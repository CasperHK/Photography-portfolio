import { Link } from "@tanstack/solid-router";
import { For } from "solid-js";
import PageFrame from "../components/PageFrame";
import { getGalleries } from "./PortfolioShared";

export default function GalleryIndexPage() {
  const galleries = getGalleries();

  return (
    <PageFrame title="Galleries" subtitle="Browse the portfolio archives by collection.">
      <section class="gallery-layout" aria-label="Galleries overview">
        <aside class="gallery-sidebar">
          <p class="gallery-kicker">Collections</p>
          <h2>Galleries</h2>
          <p class="gallery-summary">
            Enter the archive through curated sets of travel, street, and landscape work.
          </p>
          <div class="gallery-meta">
            <span>{galleries.length} collection{galleries.length === 1 ? "" : "s"}</span>
            <span>Select a gallery</span>
          </div>
        </aside>

        <div class="gallery-content">
          <section class="gallery-grid-shell" aria-label="Gallery collections">
            <div class="gallery-index-grid">
              <For each={galleries}>
                {(gallery) => (
                  <Link
                    class="gallery-card"
                    to="/gallery/$galleryId"
                    params={{ galleryId: gallery.id }}
                  >
                    <p class="gallery-card-kicker">{gallery.kicker}</p>
                    <h3>{gallery.title}</h3>
                    <p class="gallery-card-subtitle">{gallery.subtitle}</p>
                    <p class="gallery-card-summary">{gallery.summary}</p>
                    <span class="gallery-card-link">Open gallery</span>
                  </Link>
                )}
              </For>
            </div>
          </section>
        </div>
      </section>
    </PageFrame>
  );
}