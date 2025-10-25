import { z } from 'zod';
import type { getTranslations } from '$lib/stores/language';

// Factory function to create schemas with translations
export const createAuthSchemas = (t: ReturnType<typeof getTranslations>) => {
	// Sign In Schema
	const signInSchema = z.object({
		phone_number: z
			.string()
			.min(1, t.validation.phoneRequired)
			.regex(/^[0-9]+$/, t.validation.phoneInvalid)
			.min(8, t.validation.phoneMinLength)
			.max(15, t.validation.phoneMaxLength),
		password: z.string().min(1, t.validation.passwordRequired).min(8, t.validation.passwordMinLength)
	});

	// Sign Up Schema
	const signUpSchema = z.object({
		name: z.string().min(1, t.validation.nameRequired).min(2, t.validation.nameMinLength),
		username: z
			.string()
			.min(1, t.validation.usernameRequired)
			.min(3, t.validation.usernameMinLength)
			.regex(/^[a-zA-Z0-9]+$/, t.validation.usernameInvalid),
		email: z.email(t.validation.emailInvalid).optional().or(z.literal('')),
		phone_number: z
			.string()
			.min(1, t.validation.phoneRequired)
			.regex(/^[0-9]+$/, t.validation.phoneInvalid)
			.min(8, t.validation.phoneMinLength)
			.max(15, t.validation.phoneMaxLength),
		password: z.string().min(1, t.validation.passwordRequired).min(8, t.validation.passwordMinLengthSignUp)
	});

	// Forgot Password Schema
	const forgotPasswordSchema = z.object({
		email: z.email(t.validation.emailInvalid).min(1, t.validation.emailRequired)
	});

	// Reset Password Schema
	const resetPasswordSchema = z
		.object({
			password: z
				.string()
				.min(1, t.validation.passwordRequired)
				.min(8, t.validation.passwordMinLengthReset),
			password_confirmation: z.string().min(1, t.validation.confirmPasswordRequired)
		})
		.refine((data) => data.password === data.password_confirmation, {
			message: t.validation.passwordMismatch,
			path: ['password_confirmation']
		});

	return {
		signInSchema,
		signUpSchema,
		forgotPasswordSchema,
		resetPasswordSchema
	};
};

// Default schemas with English translations (for server-side use)
export const signInSchema = z.object({
	phone_number: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^[0-9]+$/, 'Phone number must contain only numbers')
		.min(8, 'Phone number must be at least 8 digits')
		.max(15, 'Phone number must be at most 15 digits'),
	password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 6 characters')
});

export const signUpSchema = z.object({
	name: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
	username: z
		.string()
		.min(1, 'Username is required')
		.min(3, 'Username must be at least 3 characters')
		.regex(/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers'),
	email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
	phone_number: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^[0-9]+$/, 'Phone number must contain only numbers')
		.min(8, 'Phone number must be at least 8 digits')
		.max(15, 'Phone number must be at most 15 digits'),
	password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters')
});

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Please enter a valid email address')
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
		password_confirmation: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Passwords do not match',
		path: ['password_confirmation']
	});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
