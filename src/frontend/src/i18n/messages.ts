import { jaMessages } from "./locales/ja";
import { zhHansMessages } from "./locales/zhHans";
import { zhHantMessages } from "./locales/zhHant";
import type { Locale, LocaleMessages } from "./types";

export type { AboutPanel, ExifLabels, GalleryInfo, Locale, LocaleMessages } from "./types";

export const SUPPORTED_LOCALES: Locale[] = ["zh-Hant", "zh-Hans", "ja"];

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文",
  ja: "日本語",
};

export const LOCALE_MESSAGES: Record<Locale, LocaleMessages> = {
  "zh-Hant": zhHantMessages,
  "zh-Hans": zhHansMessages,
  ja: jaMessages,
};
