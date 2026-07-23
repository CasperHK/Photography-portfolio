import PageFrame from "../components/PageFrame";
import styles from "./BashbaordPage.module.scss";

export default function BashbaordPage() {
  return (
    <PageFrame
      title="Admin Dashboard"
      subtitle="Manage photos, ordering, and publishing from one control surface."
    >
      <section class={styles.bashbaordShell} aria-label="Administrator dashboard">
        <aside class={styles.bashbaordSidebar} aria-label="Dashboard navigation">
          <h2>Control Panel</h2>
          <nav class={styles.bashbaordNav}>
            <a href="#photos">Photos</a>
            <a href="#albums">Albums</a>
            <a href="#publish">Publish</a>
          </nav>
        </aside>

        <div class={styles.bashbaordMain}>
          <header class={styles.bashbaordTopbar}>
            <h3>Administrator Workspace</h3>
            <p>Signed in</p>
          </header>

          <section class={styles.bashbaordContent}>
            <article id="photos" class={styles.bashbaordCard}>
              <h4>Photo Uploads</h4>
              <p>Upload, replace, and remove assets in the portfolio stream.</p>
            </article>

            <article id="albums" class={styles.bashbaordCard}>
              <h4>Album Ordering</h4>
              <p>Adjust sequence and curation for homepage and gallery sections.</p>
            </article>

            <article id="publish" class={styles.bashbaordCard}>
              <h4>Publish Status</h4>
              <p>Review visibility and push approved content live to visitors.</p>
            </article>
          </section>
        </div>
      </section>
    </PageFrame>
  );
}