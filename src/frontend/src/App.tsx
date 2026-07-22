import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import TopNavBar from "./components/TopNavBar";

type Exif = {
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  focalLength: string;
  location: string;
};

type Photo = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  sortOrder: number;
  exif?: Exif;
};

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";
const MEDIA_BASE =
  (import.meta as any).env?.VITE_MEDIA_BASE_URL ?? "http://localhost:8080";
const FORCE_DEMO_PHOTOS_BY_ENV =
  (import.meta as any).env?.VITE_FORCE_DEMO_PHOTOS === "true";

const DEMO_TILE_SIZES: Array<[number, number]> = [
  [1200, 780],
  [780, 1200],
  [1400, 900],
  [900, 1400],
  [1280, 860],
  [860, 1280],
  [1500, 980],
  [980, 1500],
];

const createDemoPhotos = (count = 30): Photo[] => {
  return Array.from({ length: count }, (_, i) => {
    const [w, h] = DEMO_TILE_SIZES[i % DEMO_TILE_SIZES.length];
    const seed = `portfolio-${i + 1}`;

    return {
      id: 10000 + i,
      title: `Demo ${i + 1}`,
      description: "",
      fileUrl: `https://picsum.photos/seed/${seed}/${w * 2}/${h * 2}`,
      thumbUrl: `https://picsum.photos/seed/${seed}/${w}/${h}`,
      width: w,
      height: h,
      sortOrder: i,
    };
  });
};

const toMediaUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${MEDIA_BASE}${path}`;

export default function App() {
  const [photos, setPhotos] = createSignal<Photo[]>([]);
  let shellRef!: HTMLElement;
  let primaryTrackRef!: HTMLDivElement;

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
      shellRef.scrollLeft += delta;

      if (shellRef.scrollLeft >= trackWidth) {
        shellRef.scrollLeft -= trackWidth;
      } else if (shellRef.scrollLeft < 0) {
        shellRef.scrollLeft += trackWidth;
      }

      if (shellRef.scrollLeft !== before) {
        pauseAutoScroll();
        event.preventDefault();
      }
    };

    const runAutoScroll = () => {
      if (Date.now() >= pausedUntil) {
        const trackWidth = primaryTrackRef?.scrollWidth ?? 0;
        if (trackWidth > 0) {
          shellRef.scrollLeft += autoSpeed;
          if (shellRef.scrollLeft >= trackWidth) {
            shellRef.scrollLeft -= trackWidth;
          }
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

  const renderTiles = (clone = false) => (
    <For each={photos()}>
      {(photo, idx) => (
        <a
          class={tileClass(photo, idx())}
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
        </a>
      )}
    </For>
  );

  return (
    <main class="page">
      <TopNavBar />

      <section ref={shellRef} class="mosaic-shell" aria-label="Portfolio gallery">
        <div class="mosaic-marquee" data-ready={hasPhotos() ? "true" : "false"}>
          <div ref={primaryTrackRef} class="mosaic-track">
            {renderTiles(false)}
          </div>
          <div class="mosaic-track mosaic-track-clone" aria-hidden="true">
            {renderTiles(true)}
          </div>
        </div>
      </section>
    </main>
  );
}
