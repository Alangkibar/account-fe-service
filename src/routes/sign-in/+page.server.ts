import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getOriginBaseURL, isValidOrigin } from '$lib/config/origins';
import { PUBLIC_API_URL } from '$env/static/public';

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
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const phone_number = data.get('phone_number')?.toString();
		const password = data.get('password')?.toString();
		const origin = url.searchParams.get('origin');

		// Validate origin
		if (!isValidOrigin(origin)) {
			return fail(400, { error: 'Invalid origin', phone_number });
		}

		// Validate input
		if (!phone_number) {
			return fail(400, { error: 'Phone number is required', phone_number });
		}

		if (!password || password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters', phone_number });
		}

		let result;
		try {
			const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

			// Call authentication API
			const response = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					phone_number,
					password,
					fcm_id: ''
				})
			});

			console.error("API_URL: ", API_URL);

			if (!response.ok) {
				// THIS is the line to check!
				const rawText = await response.text(); 
				console.error("Non-200 Status API Response:", rawText.substring(0, 20));
				// The non-JSON content should show up here!
				
				// You must still throw an error or return a proper response here
				throw error(response.status, 'Failed to load data');
			}

			try {
				result = await response.json();
				console.log(result)
			} catch (parseError) {
				console.error('Failed to parse JSON response:', parseError);
				const text = await response.text();
				console.error('Response text:', text);
				return fail(500, {
					error: 'Invalid response from server',
					phone_number
				});
			}

			if (!response.ok || !result.success) {
				return fail(response.status, {
					error: result.message || 'Invalid phone number or password',
					phone_number
				});
			}
		} catch (err) {
			console.error('Authentication error:', err);
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			return fail(500, {
				error: `An error occurred during sign in: ${errorMessage}`,
				phone_number
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

		console.log('Login successful, redirecting to:', redirectUrl);
		redirect(303, redirectUrl);
	}
} satisfies Actions;
