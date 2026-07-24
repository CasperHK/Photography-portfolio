import InfoPanel from "../components/InfoPanel";
import PageFrame from "../components/PageFrame";
import { useI18n } from "../i18n/context";

export default function ContactMePage() {
  const { messages } = useI18n();

  return (
    <PageFrame title={messages().contact.title} subtitle={messages().contact.subtitle}>
      <section class="about-shell" aria-label={messages().contact.ariaSection}>
        <div class="about-track">
          <InfoPanel heading={messages().contact.bookingsHeading}>
            <p>{messages().contact.bookingsBody}</p>
          </InfoPanel>
          <InfoPanel heading={messages().contact.emailHeading}>
            <p>hello@casperphotography.com</p>
          </InfoPanel>
          <InfoPanel heading={messages().contact.responseHeading}>
            <p>{messages().contact.responseBody}</p>
          </InfoPanel>
        </div>
      </section>
    </PageFrame>
  );
}
