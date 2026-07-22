import PageFrame from "../components/PageFrame";

export default function BashbaordPage() {
  return (
    <PageFrame
      title="Admin Dashboard"
      subtitle="Manage photos, ordering, and publishing from one control surface."
    >
      <section class="bashbaord-shell" aria-label="Administrator dashboard">
        <aside class="bashbaord-sidebar" aria-label="Dashboard navigation">
          <h2>Control Panel</h2>
          <nav class="bashbaord-nav">
            <a href="#photos">Photos</a>
            <a href="#albums">Albums</a>
            <a href="#publish">Publish</a>
          </nav>
        </aside>

        <div class="bashbaord-main">
          <header class="bashbaord-topbar">
            <h3>Administrator Workspace</h3>
            <p>Signed in</p>
          </header>

          <section class="bashbaord-content">
            <article id="photos" class="bashbaord-card">
              <h4>Photo Uploads</h4>
              <p>Upload, replace, and remove assets in the portfolio stream.</p>
            </article>

            <article id="albums" class="bashbaord-card">
              <h4>Album Ordering</h4>
              <p>Adjust sequence and curation for homepage and gallery sections.</p>
            </article>

            <article id="publish" class="bashbaord-card">
              <h4>Publish Status</h4>
              <p>Review visibility and push approved content live to visitors.</p>
            </article>
          </section>
        </div>
      </section>
    </PageFrame>
  );
}