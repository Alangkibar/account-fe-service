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
		const confirm_password = data.get('confirm_password')?.toString();
		const name = data.get('name')?.toString();
		const origin = url.searchParams.get('origin');

		// Validate origin
		if (!isValidOrigin(origin)) {
			return fail(400, { error: 'Invalid origin', phone_number, name });
		}

		// Validate input
		if (!name || name.trim().length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters', phone_number, name });
		}

		if (!phone_number) {
			return fail(400, { error: 'Phone number is required', phone_number, name });
		}

		if (!password || password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', phone_number, name });
		}

		if (password !== confirm_password) {
			return fail(400, { error: 'Passwords do not match', phone_number, name });
		}

		try {
			const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

			// Call authentication API
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					phone_number,
					password,
					fcm_id: ''
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
					name
				});
			}

			if (!response.ok || !result.success) {
				return fail(response.status, {
					error: result.message || 'Registration failed',
					phone_number,
					name
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
	
			redirect(303, redirectUrl);
		} catch (error) {
			// If it's a redirect, re-throw it
			if (error instanceof Response && error.status === 303) {
				throw error;
			}

			console.error('Sign up error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return fail(500, {
				error: `An error occurred during sign up: ${errorMessage}`,
				phone_number,
				name
			});
		}
	}
} satisfies Actions;
