import en from './translations/en';
import id from './translations/id';
import ar from './translations/ar';
import zh from './translations/zh';
import ru from './translations/ru';
import ja from './translations/ja';

export const translations = {
	en,
	id,
	ar,
	zh,
	ru,
	ja
} as const;

export const languages = [
	{ code: 'en', name: 'English', nativeName: 'English' },
	{ code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
	{ code: 'ar', name: 'Arabic', nativeName: 'العربية' },
	{ code: 'zh', name: 'Chinese', nativeName: '中文' },
	{ code: 'ru', name: 'Russian', nativeName: 'Русский' },
	{ code: 'ja', name: 'Japanese', nativeName: '日本語' }
] as const;

export type LanguageCode = keyof typeof translations;
export type Translation = typeof en;
