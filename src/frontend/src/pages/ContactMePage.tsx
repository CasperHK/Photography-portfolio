import PageFrame from "../components/PageFrame";
import { useI18n } from "../i18n/context";

export default function ContactMePage() {
  const { messages } = useI18n();

  return (
    <PageFrame title={messages().contact.title} subtitle={messages().contact.subtitle}>
      <section class="about-shell" aria-label={messages().contact.ariaSection}>
        <div class="about-track">
          <article class="about-card">
            <h2>{messages().contact.bookingsHeading}</h2>
            <p>{messages().contact.bookingsBody}</p>
          </article>
          <article class="about-card">
            <h2>{messages().contact.emailHeading}</h2>
            <p>hello@casperphotography.com</p>
          </article>
          <article class="about-card">
            <h2>{messages().contact.responseHeading}</h2>
            <p>{messages().contact.responseBody}</p>
          </article>
        </div>
      </section>
    </PageFrame>
  );
}
