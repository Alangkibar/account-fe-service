import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, type LanguageCode } from '$lib/i18n';

const defaultLanguage: LanguageCode = 'en';

function createLanguageStore() {
	const { subscribe, set, update } = writable<LanguageCode>(defaultLanguage);

	// Initialize from localStorage if in browser
	if (browser) {
		const stored = localStorage.getItem('language') as LanguageCode | null;
		if (stored && stored in translations) {
			set(stored);
			document.documentElement.setAttribute('lang', stored);
			if (stored === 'ar') {
				document.documentElement.setAttribute('dir', 'rtl');
			}
		}
	}

	return {
		subscribe,
		set: (lang: LanguageCode) => {
			if (browser) {
				localStorage.setItem('language', lang);
				document.documentElement.setAttribute('lang', lang);
				if (lang === 'ar') {
					document.documentElement.setAttribute('dir', 'rtl');
				} else {
					document.documentElement.setAttribute('dir', 'ltr');
				}
			}
			set(lang);
		}
	};
}

export const language = createLanguageStore();

// Derived store for translations
export function getTranslations(lang: LanguageCode) {
	return translations[lang];
}
