import { For, createMemo } from "solid-js";
import GalleryCard from "../components/GalleryCard";
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
                  <GalleryCard
                    gallery={gallery}
                    openGalleryLabel={messages().galleryIndex.openGallery}
                  />
                )}
              </For>
            </div>
          </section>
        </div>
      </section>
    </PageFrame>
  );
}