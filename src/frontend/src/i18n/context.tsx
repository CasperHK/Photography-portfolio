import {
  createEffect,
  createContext,
  createMemo,
  createSignal,
  type Accessor,
  type JSX,
  useContext,
} from "solid-js";
import { i18n as linguiI18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/solid";
import {
  LOCALE_MESSAGES,
  SUPPORTED_LOCALES,
  type Locale,
  type LocaleMessages,
} from "./messages";

type I18nContextValue = {
  locale: Accessor<Locale>;
  setLocale: (nextLocale: Locale) => void;
  messages: Accessor<LocaleMessages>;
};

const STORAGE_KEY = "portfolio-locale";
const FALLBACK_LOCALE: Locale = "zh-Hant";
const I18nContext = createContext<I18nContextValue>();

const isLocale = (value: string): value is Locale => {
  return SUPPORTED_LOCALES.includes(value as Locale);
};

const detectLocaleFromTag = (tag: string): Locale | null => {
  const normalized = tag.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.startsWith("ja")) {
    return "ja";
  }

  if (normalized.startsWith("zh")) {
    if (
      normalized.includes("hant") ||
      normalized.includes("-tw") ||
      normalized.includes("-hk") ||
      normalized.includes("-mo")
    ) {
      return "zh-Hant";
    }

    return "zh-Hans";
  }

  return null;
};

const getInitialLocale = (): Locale => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) {
      return stored;
    }

    const browserLanguages = Array.isArray(window.navigator.languages)
      ? window.navigator.languages
      : [window.navigator.language];

    for (const lang of browserLanguages) {
      if (!lang) continue;
      const detected = detectLocaleFromTag(lang);
      if (detected) {
        return detected;
      }
    }
  }

  return FALLBACK_LOCALE;
};

export function I18nProvider(props: { children: JSX.Element }) {
  const [locale, setLocaleSignal] = createSignal<Locale>(getInitialLocale());

  createEffect(() => {
    const activeLocale = locale();
    linguiI18n.load(activeLocale, {});
    linguiI18n.activate(activeLocale);

    if (typeof document !== "undefined") {
      document.documentElement.lang = activeLocale;
    }
  });

  const setLocale = (nextLocale: Locale) => {
    setLocaleSignal(nextLocale);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }
  };

  const messages = createMemo(() => LOCALE_MESSAGES[locale()]);

  return (
    <LinguiProvider i18n={linguiI18n}>
      <I18nContext.Provider value={{ locale, setLocale, messages }}>
        {props.children}
      </I18nContext.Provider>
    </LinguiProvider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
};
