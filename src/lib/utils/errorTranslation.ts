import type { getTranslations } from '$lib/stores/language';

/**
 * Translates server error codes to localized error messages
 * @param errorCode - The error code from the server
 * @param t - Translation object from getTranslations
 * @returns Localized error message
 */
export function translateErrorCode(
	errorCode: string,
	t: ReturnType<typeof getTranslations>
): string {
	switch (errorCode) {
		// Authentication errors
		case 'INVALID_CREDENTIALS':
			return t.error.invalidCredentials;
		case 'INVALID_PHONE_OR_PASSWORD':
			return t.error.invalidPhoneOrPassword;

		// Registration errors
		case 'PHONE_NUMBER_ALREADY_EXISTS':
		case 'PHONE_ALREADY_REGISTERED':
			return t.error.phoneAlreadyRegistered;
		case 'EMAIL_ALREADY_EXISTS':
		case 'EMAIL_ALREADY_REGISTERED':
			return t.error.emailAlreadyRegistered;
		case 'USERNAME_ALREADY_EXISTS':
		case 'USERNAME_ALREADY_TAKEN':
			return t.error.usernameAlreadyTaken;
		case 'REGISTRATION_FAILED':
			return t.error.registrationFailed;

		// Forgot password errors
		case 'EMAIL_NOT_FOUND':
		case 'USER_NOT_FOUND':
			return t.error.emailNotFound;
		case 'FORGOT_PASSWORD_FAILED':
			return t.error.forgotPasswordFailed;
		case 'EMAIL_NOT_REGISTERED':
			return t.error.emailNotRegistered;

		// Reset password errors
		case 'TOKEN_EXPIRED':
		case 'INVALID_TOKEN':
			return t.error.tokenExpired;
		case 'PASSWORD_RESET_FAILED':
			return t.error.passwordResetFailed;

		// Unknown error
		default:
			return errorCode;
	}
}

/**
 * Get translated error messages from form errors
 * Handles both error arrays and single error messages
 * @param form - Form action data
 * @param t - Translation object from getTranslations
 * @param fallbackMessage - Optional fallback message if no errors found
 * @returns Translated error message string
 */
export function getErrorMessages(
	form: any,
	t: ReturnType<typeof getTranslations>,
	fallbackMessage?: string
): string {
	if (!form?.errors) {
		return form?.errorMessage || form?.error || fallbackMessage || '';
	}

	// If there are error codes, translate them
	if (Array.isArray(form.errors) && form.errors.length > 0) {
		const translatedErrors = form.errors.map((code: string) => translateErrorCode(code, t));
		return translatedErrors.join(', ');
	}

	// Fallback to server message or generic error
	return form?.errorMessage || form?.error || fallbackMessage || '';
}
