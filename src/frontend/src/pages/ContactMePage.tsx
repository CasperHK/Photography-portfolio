import PageFrame from "../components/PageFrame";

export default function ContactMePage() {
  return (
    <PageFrame
      title="Contact Me"
      subtitle="Share your idea, location, and timeline to start planning the shoot."
    >
      <section class="about-shell" aria-label="Contact Casper Photography">
        <div class="about-track">
          <article class="about-card">
            <h2>Bookings</h2>
            <p>
              For editorial, travel, and brand collaborations, send a short brief with dates,
              location, and expected deliverables.
            </p>
          </article>
          <article class="about-card">
            <h2>Email</h2>
            <p>hello@casperphotography.com</p>
          </article>
          <article class="about-card">
            <h2>Response Time</h2>
            <p>Usually within 24 to 48 hours.</p>
          </article>
        </div>
      </section>
    </PageFrame>
  );
}
