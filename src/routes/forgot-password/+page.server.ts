import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { isValidOrigin } from '$lib/config/origins';

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
		const phone_number = data.get('phone_number')?.toString();
		const origin = url.searchParams.get('origin');

		// Validate origin
		if (!isValidOrigin(origin)) {
			return fail(400, { error: 'Invalid origin', phone_number });
		}

		// Validate input
		if (!phone_number) {
			return fail(400, { error: 'Phone number is required', phone_number });
		}

		try {
			const API_URL = env.API_URL || 'http://localhost:3000';

			console.log('Attempting password reset to:', `${API_URL}/auth/forgot-password`);
			console.log('Phone number:', phone_number);
			console.log('Origin:', origin);

			// Call authentication API
			const response = await fetch(`${API_URL}/auth/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					phone_number
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
					phone_number
				});
			}

			console.log('Parsed result:', result);
			if (!response.ok || !result.success) {
				return fail(response.status, {
					error: result.message || 'Failed to send reset instructions',
					phone_number
				});
			}

			// Return success
			return {
				success: true,
				message: result.message || 'Password reset instructions have been sent to your phone',
				phone_number
			};
		} catch (error) {
			console.error('Password reset error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return fail(500, {
				error: `An error occurred: ${errorMessage}`,
				phone_number
			});
		}
	}
} satisfies Actions;
