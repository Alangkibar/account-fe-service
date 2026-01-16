import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const origin = url.searchParams.get('origin');

	if (!token) {
		throw error(400, 'Token is required');
	}

	try {
		const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

		// Verify token with API
		const response = await fetch(`${API_URL}/auth/forgot-password/verify/${token}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		let result;
		try {
			result = await response.json();
		} catch (parseError) {
			console.error('Failed to parse JSON response:', parseError);
			throw error(500, 'Invalid response from server');
		}

		if (!response.ok || !result.success) {
			// Handle token verification errors
			const errorCodes: string[] = [];

			// Check if errors is an array
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

			// Check if token is invalid or expired
			const isInvalidToken =
				errorCodes.includes('INVALID_FORGOT_PASSWORD_TOKEN') ||
				errorCodes.includes('TOKEN_EXPIRED') ||
				errorCodes.includes('INVALID_TOKEN');

			// Return invalid token state instead of throwing error
			if (isInvalidToken) {
				return {
					token,
					verified: false,
					invalidToken: true,
					errorCodes,
					errorMessage: result.message || 'Invalid or expired token',
					origin: origin || 'localplace'
				};
			}

			throw error(response.status, {
				message: result.message || 'Invalid or expired token',
				errors: errorCodes
			} as any);
		}

		return {
			token,
			verified: true,
			expired_at: result.data?.expired_at,
			origin: origin || 'localplace'
		};
	} catch (err) {
		console.error('Token verification error:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'An error occurred during token verification');
	}
};

export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const password = data.get('password')?.toString();
		const password_confirmation = data.get('password_confirmation')?.toString();
		const token = url.searchParams.get('token');

		// Validate token
		if (!token) {
			return fail(400, { error: 'Token is required' });
		}

		// Validate input
		if (!password) {
			return fail(400, { error: 'Password is required' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		if (!password_confirmation) {
			return fail(400, { error: 'Password confirmation is required' });
		}

		if (password !== password_confirmation) {
			return fail(400, { error: 'Passwords do not match' });
		}

		try {
			const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

			// Call password reset API
			const response = await fetch(`${API_URL}/auth/forgot-password/verify/${token}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					password,
					password_confirmation
				})
			});

			let result;
			try {
				result = await response.json();
			} catch (parseError) {
				console.error('Failed to parse JSON response:', parseError);
				return fail(500, {
					error: 'Invalid response from server'
				});
			}

			if (!response.ok || !result.success) {
				// Handle multiple errors from API
				const errorCodes: string[] = [];

				// Check if errors is an array
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
					errors: errorCodes.length > 0 ? errorCodes : ['PASSWORD_RESET_FAILED'],
					errorMessage: result.message
				});
			}

			// Success - redirect to sign in
			return {
				success: true,
				message: result.message || 'Password has been reset successfully'
			};
		} catch (error) {
			console.error('Password reset error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return fail(500, {
				error: `An error occurred: ${errorMessage}`
			});
		}
	}
} satisfies Actions;
