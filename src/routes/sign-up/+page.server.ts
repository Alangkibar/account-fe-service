import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getOriginBaseURL, isValidOrigin } from '$lib/config/origins';
import { PUBLIC_API_URL } from '$env/static/public';
import { signUpSchema } from '$lib/schemas/auth';

export const load: PageServerLoad = async ({ url }) => {
	const origin = url.searchParams.get('origin');
	const trx_code = url.searchParams.get('trx_code');

	if (!isValidOrigin(origin)) {
		throw error(405, 'Access denied. Origin parameter is required.');
	}

	return {
		origin,
		trx_code
	};
};

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		let phone_number = data.get('phone_number')?.toString() || '';
		const password = data.get('password')?.toString() || '';
		const name = data.get('name')?.toString() || '';
		const username = data.get('username')?.toString() || '';
		const email = data.get('email')?.toString() || '';
		const referral_code = data.get('referral_code')?.toString();
		const origin = url.searchParams.get('origin');
		const trx_code = url.searchParams.get('trx_code');

		// Validate origin
		if (!isValidOrigin(origin)) {
			return fail(400, {
				fieldErrors: { name: ['Invalid origin'] },
				phone_number: data.get('phone_number')?.toString() || '',
				name: data.get('name')?.toString() || '',
				username: data.get('username')?.toString() || '',
				email: data.get('email')?.toString() || ''
			});
		}

		// Format phone number: remove +62 prefix and leading 0
		if (phone_number) {
			phone_number = phone_number.replace(/^\+62/, '').replace(/^0/, '');
		}

		// Validate input with Zod
		const validation = signUpSchema.safeParse({
			name,
			username,
			email,
			phone_number,
			password
		});

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
				phone_number: data.get('phone_number')?.toString() || '',
				name: data.get('name')?.toString() || '',
				username: data.get('username')?.toString() || '',
				email: data.get('email')?.toString() || ''
			});
		}

		const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

		// Call authentication API
		const response = await fetch(`${API_URL}/auth/register/user`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				username: username || phone_number, // Use phone_number as username if not provided
				email: email || null,
				phone_number,
				password,
				referral_code: referral_code || '',
				fcm_id: '',
				trx_code: trx_code || undefined 
			})
		});

		let result;
		try {
			result = await response.json();
		} catch (parseError) {
			console.error('Failed to parse JSON response:', parseError);
			return fail(500, {
				error: 'Invalid response from server',
				phone_number,
				name,
				username,
				email
			});
		}

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
				errors: errorCodes.length > 0 ? errorCodes : ['REGISTRATION_FAILED'],
				errorMessage: result.message,
				phone_number,
				name,
				username,
				email
			});
		}

		// Set authentication cookie with the token from API response
		if (result.data?.access_token) {
			cookies.set('auth_token', result.data.access_token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		}

		// Store user data if returned
		if (result.data) {
			cookies.set('user_data', JSON.stringify(result.data), {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		}

		// Redirect to origin subdomain with token
		const token = result.data?.access_token;
		const redirectUrl = `${getOriginBaseURL(origin)}/authenticating?token=${encodeURIComponent(token)}`;

		throw redirect(303, redirectUrl);
	}
} satisfies Actions;
