import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const THEME_COLORS = {
	light: '#ffffff',
	dark: '#00262a'
} as const;

function updateMetaThemeColor(theme: Theme) {
	if (!browser) return;

	let metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (!metaThemeColor) {
		metaThemeColor = document.createElement('meta');
		metaThemeColor.setAttribute('name', 'theme-color');
		document.head.appendChild(metaThemeColor);
	}
	metaThemeColor.setAttribute('content', THEME_COLORS[theme]);
}

function createThemeStore() {
	let currentTheme: Theme = 'light';

	if (browser) {
		const stored = localStorage.getItem('theme') as Theme;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		currentTheme = stored || (prefersDark ? 'dark' : 'light');
	}

	const { subscribe, set, update } = writable<Theme>(currentTheme);

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const next: Theme = current === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem('theme', next);
					if (next === 'dark') {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
					updateMetaThemeColor(next);
				}
				return next;
			});
		},
		set: (value: Theme) => {
			if (browser) {
				localStorage.setItem('theme', value);
				if (value === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
				updateMetaThemeColor(value);
			}
			set(value);
		},
		init: () => {
			if (browser) {
				const stored = localStorage.getItem('theme') as Theme;
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const theme = stored || (prefersDark ? 'dark' : 'light');

				if (theme === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
				updateMetaThemeColor(theme);
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();
