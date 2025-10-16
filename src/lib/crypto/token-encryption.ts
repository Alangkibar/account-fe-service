/**
 * Token encryption library using AES-GCM encryption
 * Provides functions to encrypt and decrypt JWT tokens for secure URL transmission
 */

/**
 * Encrypts a JWT token using AES-GCM encryption
 * @param token - The JWT token to encrypt
 * @param secretKey - 32-byte secret key (should be loaded from environment variables)
 * @returns Base64-encoded encrypted token (nonce + ciphertext)
 */
export async function encryptToken(token: string, secretKey: string): Promise<string> {
	// Convert secret key to bytes (must be exactly 32 bytes for AES-256)
	const keyBytes = new TextEncoder().encode(secretKey.padEnd(32, '0').slice(0, 32));

	// Import the key for AES-GCM
	const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
		'encrypt'
	]);

	// Generate random nonce (12 bytes is standard for GCM)
	const nonce = crypto.getRandomValues(new Uint8Array(12));

	// Convert token to bytes
	const tokenBytes = new TextEncoder().encode(token);

	// Encrypt the token
	const ciphertext = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: nonce
		},
		cryptoKey,
		tokenBytes
	);

	// Combine nonce and ciphertext
	const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
	combined.set(nonce, 0);
	combined.set(new Uint8Array(ciphertext), nonce.length);

	// Base64-encode for URL safety (using URL-safe encoding)
	return base64UrlEncode(combined);
}

/**
 * Decrypts an encrypted token back to the original JWT
 * @param encryptedToken - Base64-encoded encrypted token
 * @param secretKey - 32-byte secret key (must match the key used for encryption)
 * @returns Decrypted JWT token
 */
export async function decryptToken(encryptedToken: string, secretKey: string): Promise<string> {
	// Convert secret key to bytes (must be exactly 32 bytes for AES-256)
	const keyBytes = new TextEncoder().encode(secretKey.padEnd(32, '0').slice(0, 32));

	// Import the key for AES-GCM
	const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
		'decrypt'
	]);

	// Decode base64
	const data = base64UrlDecode(encryptedToken);

	if (data.length < 12) {
		throw new Error('Invalid encrypted data: too short');
	}

	// Extract nonce (first 12 bytes) and ciphertext (rest)
	const nonce = data.slice(0, 12);
	const ciphertext = data.slice(12);

	// Decrypt
	const decrypted = await crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: nonce
		},
		cryptoKey,
		ciphertext
	);

	// Convert bytes back to string
	return new TextDecoder().decode(decrypted);
}

/**
 * Base64 URL-safe encoding (replaces + with -, / with _, and removes padding =)
 */
function base64UrlEncode(data: Uint8Array): string {
	const base64 = btoa(String.fromCharCode(...data));
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64 URL-safe decoding
 */
function base64UrlDecode(encoded: string): Uint8Array {
	// Add padding back
	let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
	const padding = base64.length % 4;
	if (padding > 0) {
		base64 += '='.repeat(4 - padding);
	}

	// Decode base64
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}
