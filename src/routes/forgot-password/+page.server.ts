import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isValidOrigin } from '$lib/config/origins';
import { PUBLIC_API_URL } from '$env/static/public';
import { forgotPasswordSchema } from '$lib/schemas/auth';

export const load: PageServerLoad = async ({ url }) => {
	const origin = url.searchParams.get('origin');

	if (!isValidOrigin(origin)) {
		throw error(405, 'Access denied. Origin parameter is required.');
	}

	return {
		origin
	};
};

export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() || '';
		const origin = url.searchParams.get('origin');

		// Validate origin
		if (!isValidOrigin(origin)) {
			return fail(400, {
				fieldErrors: { email: ['Invalid origin'] },
				email: data.get('email')?.toString() || ''
			});
		}

		// Validate input with Zod
		const validation = forgotPasswordSchema.safeParse({ email });

		if (!validation.success) {
			const fieldErrors: Record<string, string[]> = {};
			validation.error.issues.forEach((err) => {
				const field = err.path[0] as string;
				if (!fieldErrors[field]) {
					fieldErrors[field] = [];
				}
				fieldErrors[field].push(err.message);
			});

			return fail(400, {
				fieldErrors,
				email: data.get('email')?.toString() || ''
			});
		}

		try {
			const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

			console.log('Attempting password reset to:', `${API_URL}/auth/forgot-password/user`);
			console.log('Email:', email);
			console.log('Origin:', origin);

			// Call authentication API
			const response = await fetch(`${API_URL}/auth/forgot-password/user`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email
				})
			});

			console.log('Response status:', response.status);

			let result;
			try {
				result = await response.json();
				console.log('Response data:', result);
			} catch (parseError) {
				console.error('Failed to parse JSON response:', parseError);
				return fail(500, {
					error: 'Invalid response from server',
					email
				});
			}

			console.log('Parsed result:', result);
			if (!response.ok || !result.success) {
				// Handle multiple errors from API
				const errorCodes: string[] = [];

				// Check if errors array exists
				if (result.errors && Array.isArray(result.errors)) {
					result.errors.forEach((err: any) => {
						// If error is a string, push it directly
						if (typeof err === 'string') {
							errorCodes.push(err);
						}
						// If error is an object with code property
						else if (err.code) {
							errorCodes.push(err.code);
						}
					});
				}
				// Fallback to single error object
				else if (result.error?.code) {
					errorCodes.push(result.error.code);
				}

				return fail(response.status, {
					errors: errorCodes.length > 0 ? errorCodes : ['FORGOT_PASSWORD_FAILED'],
					errorMessage: result.message,
					email
				});
			}

			// Return success
			return {
				success: true,
				message: result.message || 'Password reset instructions have been sent to your email',
				email
			};
		} catch (error) {
			console.error('Password reset error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return fail(500, {
				error: `An error occurred: ${errorMessage}`,
				email
			});
		}
	}
} satisfies Actions;
