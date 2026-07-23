import { Link } from "@tanstack/solid-router";
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "../i18n/messages";
import { useI18n } from "../i18n/context";

type TopNavBarProps = {
  title?: string;
  subtitle?: string;
};

export default function TopNavBar(props: TopNavBarProps) {
  const { locale, setLocale, messages } = useI18n();

  const onLocaleChange = (event: Event) => {
    const nextLocale = (event.currentTarget as HTMLSelectElement).value as Locale;
    setLocale(nextLocale);
  };

  return (
    <header class="brand navbar bg-base-100/60 border-b border-base-content/10">
      <div class="brand-copy navbar-start">
        <h1>{props.title ?? messages().nav.title}</h1>
        <p>{props.subtitle ?? messages().nav.subtitle}</p>
      </div>
      <nav class="brand-nav navbar-end" aria-label={messages().nav.primaryAria}>
        <Link class="btn btn-ghost btn-sm" to="/">
          {messages().nav.home}
        </Link>
        <Link class="btn btn-ghost btn-sm" to="/about">
          {messages().nav.about}
        </Link>
        <Link class="btn btn-ghost btn-sm" to="/galleries">
          {messages().nav.galleries}
        </Link>
        <Link class="btn btn-ghost btn-sm" to="/contact-me">
          {messages().nav.contactMe}
        </Link>
        <label class="brand-locale" for="locale-switcher">
          <span>{messages().nav.languageLabel}</span>
          <select
            id="locale-switcher"
            class="brand-locale-select select select-bordered select-xs"
            value={locale()}
            onInput={onLocaleChange}
          >
            {SUPPORTED_LOCALES.map((supportedLocale) => (
              <option value={supportedLocale}>{LOCALE_LABELS[supportedLocale]}</option>
            ))}
          </select>
        </label>
      </nav>
    </header>
  );
}