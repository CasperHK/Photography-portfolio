import { createMemo, createSignal, For, onMount } from "solid-js";
import PageFrame from "../components/PageFrame";
import ScrollTopButton from "../components/buttons/ScrollTopButton";
import {
  API_BASE,
  FORCE_DEMO_PHOTOS_BY_ENV,
  GALLERY_NOTES,
  createDemoPhotos,
  toMediaUrl,
  type Photo,
} from "./PortfolioShared";

export default function GalleryPage() {
  const [photos, setPhotos] = createSignal<Photo[]>([]);
  const [galleryScrollEl, setGalleryScrollEl] = createSignal<HTMLElement | null>(null);

  onMount(() => {
    const query = new URLSearchParams(window.location.search);
    const forceDemoByQuery = query.get("demo") === "1";
    const forceDemoPhotos = FORCE_DEMO_PHOTOS_BY_ENV || forceDemoByQuery;

    void (async () => {
      if (forceDemoPhotos) {
        setPhotos(createDemoPhotos(30));
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/albums/portfolio/photos`);
        const data = await res.json();
        const fetched = data.photos ?? [];
        setPhotos(fetched.length ? fetched : createDemoPhotos(30));
      } catch (err) {
        console.error("Failed to fetch photos:", err);
        setPhotos(createDemoPhotos(30));
      }
    })();
  });

  const hasPhotos = createMemo(() => photos().length > 0);

  const renderTiles = (clone = false) => (
    <For each={photos()}>
      {(photo) => (
        <a
          class="gallery-photo"
          href={toMediaUrl(photo.fileUrl)}
          target="_blank"
          rel="noreferrer"
          aria-label={clone ? undefined : `Open ${photo.title} in a new tab`}
          tabIndex={clone ? -1 : undefined}
        >
          <img
            src={toMediaUrl(photo.thumbUrl)}
            alt={clone ? "" : photo.title}
            loading="lazy"
          />
          <span class="gallery-photo-label" aria-hidden={clone ? "true" : undefined}>
            {photo.title}
          </span>
        </a>
      )}
    </For>
  );

  return (
    <PageFrame
      title="Gallery"
      subtitle="A structured edit with notes, sequencing, and vertical studies."
    >
      <section class="gallery-layout" aria-label="Portfolio gallery">
        <aside class="gallery-sidebar">
          <p class="gallery-kicker">Archive</p>
          <h2>Gallery</h2>
          <p class="gallery-summary">
            A horizontal edit of field notes, road edges, weather, and passing light.
          </p>
          <div class="gallery-meta">
            <span>{photos().length || 30} frames</span>
            <span>Continuous scroll</span>
          </div>
          <ul class="gallery-notes" aria-label="Gallery notes">
            <For each={GALLERY_NOTES}>{(note) => <li>{note}</li>}</For>
          </ul>
        </aside>

        <div class="gallery-content">
          <section
            class="gallery-grid-shell"
            aria-label="Portfolio gallery stream"
            ref={setGalleryScrollEl}
          >
            <div class="gallery-grid" data-ready={hasPhotos() ? "true" : "false"}>
              {renderTiles(false)}
            </div>
          </section>
        </div>
      </section>

      <ScrollTopButton target={galleryScrollEl()} showAfter={140} ariaLabel="Scroll gallery to top" />
    </PageFrame>
  );
}
