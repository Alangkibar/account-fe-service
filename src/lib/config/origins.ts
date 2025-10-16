import { PUBLIC_BASE_URL_FITLY, PUBLIC_BASE_URL_LOCAL_LAB, PUBLIC_BASE_URL_LOCAL_PLACE } from "$env/static/public";

export const VALID_ORIGINS = ['fitly', 'localplace', 'locallab'] as const;
export type ValidOrigin = typeof VALID_ORIGINS[number];

export interface OriginConfig {
	name: string;
	color: string;
	accentColor: string;
}

export const originConfig: Record<ValidOrigin, OriginConfig> = {
	fitly: {
		name: 'Fitly',
		color: '#10b981', // green-500
		accentColor: '#059669' // green-600
	},
	localplace: {
		name: 'LocalPlace',
		color: '#3b82f6', // blue-500
		accentColor: '#2563eb' // blue-600
	},
	locallab: {
		name: 'LocalLab',
		color: '#8b5cf6', // purple-500
		accentColor: '#7c3aed' // purple-600
	}
};

export function isValidOrigin(origin: string | null): origin is ValidOrigin {
	return origin !== null && VALID_ORIGINS.includes(origin as ValidOrigin);
}

export function getOriginConfig(origin: ValidOrigin): OriginConfig {
	return originConfig[origin];
}

export function getOriginBaseURL(origin: ValidOrigin): string {
	let result
	switch (origin) {
		case VALID_ORIGINS[0]:
			result = PUBLIC_BASE_URL_FITLY
			break;
		case VALID_ORIGINS[1]:
			result = PUBLIC_BASE_URL_LOCAL_PLACE
			break;
		case VALID_ORIGINS[2]:
			result = PUBLIC_BASE_URL_LOCAL_LAB
			break;
	}

	return result
}
