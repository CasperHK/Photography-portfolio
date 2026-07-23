import { Link } from "@tanstack/solid-router";
import { For, createMemo } from "solid-js";
import PageFrame from "../components/PageFrame";
import { useI18n } from "../i18n/context";

export default function GalleryIndexPage() {
  const { messages } = useI18n();
  const galleries = createMemo(() => Object.values(messages().galleries));

  return (
    <PageFrame title={messages().galleryIndex.title} subtitle={messages().galleryIndex.subtitle}>
      <section class="gallery-layout" aria-label={messages().galleryIndex.ariaOverview}>
        <aside class="gallery-sidebar">
          <p class="gallery-kicker">{messages().galleryIndex.kicker}</p>
          <h2>{messages().galleryIndex.title}</h2>
          <p class="gallery-summary">{messages().galleryIndex.summary}</p>
          <div class="gallery-meta">
            <span>{messages().galleryIndex.collectionsCount(galleries().length)}</span>
            <span>{messages().galleryIndex.selectGallery}</span>
          </div>
        </aside>

        <div class="gallery-content">
          <section class="gallery-grid-shell" aria-label={messages().galleryIndex.ariaCollections}>
            <div class="gallery-index-grid">
              <For each={galleries()}>
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
                    <span class="gallery-card-link">{messages().galleryIndex.openGallery}</span>
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