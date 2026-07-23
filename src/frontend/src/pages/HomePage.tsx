import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import PageFrame from "../components/PageFrame";
import PhotoViewer from "../components/dialogs/PhotoViewer";
import { useI18n } from "../i18n/context";
import {
  FORCE_DEMO_PHOTOS_BY_ENV,
  createDemoPhotos,
  loadPortfolioPhotos,
  toMediaUrl,
  type Photo,
} from "./PortfolioShared";

export default function HomePage() {
  const { messages } = useI18n();
  const [photos, setPhotos] = createSignal<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = createSignal<Photo | null>(null);
  let shellRef!: HTMLElement;
  let primaryTrackRef!: HTMLDivElement;

  const normalizeScrollLeft = (value: number, trackWidth: number) => {
    if (trackWidth <= 0) return 0;
    return ((value % trackWidth) + trackWidth) % trackWidth;
  };

  onMount(() => {
    const query = new URLSearchParams(window.location.search);
    const forceDemoByQuery = query.get("demo") === "1";
    const forceDemoPhotos = FORCE_DEMO_PHOTOS_BY_ENV || forceDemoByQuery;

    let rafId = 0;
    let pausedUntil = 0;
    const autoSpeed = 0.95;

    const pauseAutoScroll = (ms = 1800) => {
      pausedUntil = Date.now() + ms;
    };

    const handleWheel = (event: WheelEvent) => {
      const trackWidth = primaryTrackRef?.scrollWidth ?? 0;
      if (trackWidth <= 0) return;

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (delta === 0) return;

      const before = shellRef.scrollLeft;
      const next = normalizeScrollLeft(before + delta, trackWidth);
      shellRef.scrollLeft = next;

      if (shellRef.scrollLeft !== before) {
        pauseAutoScroll();
        event.preventDefault();
      }
    };

    const runAutoScroll = () => {
      if (Date.now() >= pausedUntil) {
        const trackWidth = primaryTrackRef?.scrollWidth ?? 0;
        if (trackWidth > 0) {
          shellRef.scrollLeft = normalizeScrollLeft(shellRef.scrollLeft + autoSpeed, trackWidth);
        }
      }

      rafId = window.requestAnimationFrame(runAutoScroll);
    };

    shellRef.addEventListener("wheel", handleWheel, { passive: false });
    rafId = window.requestAnimationFrame(runAutoScroll);

    onCleanup(() => {
      window.cancelAnimationFrame(rafId);
      shellRef.removeEventListener("wheel", handleWheel);
    });

    void (async () => {
      if (forceDemoPhotos) {
        setPhotos(createDemoPhotos(30, messages().demo));
        return;
      }

      setPhotos(await loadPortfolioPhotos(30, messages().demo));
    })();
  });

  const tileClass = (photo: Photo, index: number) => {
    const ratio = photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1.4;

    if (index % 11 === 0) return "tile hero";
    if (ratio >= 1.75) {
      return index % 3 === 0 ? "tile wide hero-lite" : "tile wide";
    }
    if (ratio <= 0.82) {
      return index % 4 === 0 ? "tile tall hero-lite" : "tile tall";
    }
    if (index % 5 === 0) return "tile large";
    return "tile medium";
  };

  const hasPhotos = createMemo(() => photos().length > 0);

  const openPhotoViewer = (photo: Photo, event?: MouseEvent) => {
    if (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      event.preventDefault();
    }

    setSelectedPhoto(photo);
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  return (
    <PageFrame title={messages().nav.title} subtitle={messages().nav.subtitle}>
      <section ref={shellRef} class="mosaic-shell" aria-label={messages().home.ariaPortfolioGallery}>
        <div class="mosaic-marquee" data-ready={hasPhotos() ? "true" : "false"}>
          <div ref={primaryTrackRef} class="mosaic-track">
            <For each={photos()}>
              {(photo, idx) => (
                <a
                  class={tileClass(photo, idx())}
                  href={toMediaUrl(photo.fileUrl)}
                  aria-label={messages().home.openPhotoViewerAria(photo.title)}
                  onClick={(event) => openPhotoViewer(photo, event)}
                >
                  <img src={toMediaUrl(photo.thumbUrl)} alt={photo.title} loading="lazy" />
                </a>
              )}
            </For>
          </div>
          <div class="mosaic-track mosaic-track-clone" aria-hidden="true">
            <For each={photos()}>
              {(photo, idx) => (
                <a
                  class={tileClass(photo, idx())}
                  href={toMediaUrl(photo.fileUrl)}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img src={toMediaUrl(photo.thumbUrl)} alt="" loading="lazy" />
                </a>
              )}
            </For>
          </div>
        </div>
      </section>

      <PhotoViewer
        open={selectedPhoto() !== null}
        photo={selectedPhoto()}
        galleryTitle={messages().home.galleryTitle}
        onClose={closePhotoViewer}
      />
    </PageFrame>
  );
}
