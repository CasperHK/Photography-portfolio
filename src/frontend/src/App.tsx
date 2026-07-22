import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function App() {
  const [photos, setPhotos] = createSignal<Photo[]>([]);
  const [active, setActive] = createSignal(0);
  const [open, setOpen] = createSignal(false);
  const [exifOpen, setExifOpen] = createSignal(false);

  let sectionRef!: HTMLDivElement;
  let trackRef!: HTMLDivElement;

  onMount(async () => {
    try {
      const res = await fetch(`${API_BASE}/albums/portfolio/photos`);
      const data = await res.json();
      setPhotos(data.photos ?? []);
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    }
  });

  createEffect(() => {
    const list = photos();
    if (!list.length || !sectionRef || !trackRef) return;

    const cards = gsap.utils.toArray<HTMLElement>(".photo-card");
    const totalWidth = () =>
      cards.reduce((sum, card) => sum + card.offsetWidth + 24, 0) -
      window.innerWidth +
      80;

    const tween = gsap.to(trackRef, {
      x: () => -Math.max(totalWidth(), 0),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef,
        start: "top top",
        end: () => `+=${Math.max(totalWidth(), 1000)}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  const current = () => photos()[active()];

  const openPhoto = (idx: number) => {
    setActive(idx);
    setOpen(true);
    setExifOpen(false);
  };

  const prevPhoto = (e: MouseEvent) => {
    e.stopPropagation();
    setActive((v) => (v - 1 + photos().length) % photos().length);
  };

  const nextPhoto = (e: MouseEvent) => {
    e.stopPropagation();
    setActive((v) => (v + 1) % photos().length);
  };

  return (
    <div>
      {/* Top navigation */}
      <header
        style={{
          position: "fixed",
          top: "16px",
          left: "24px",
          "z-index": "50",
          "font-weight": "700",
          "letter-spacing": "0.05em",
          "font-size": "1rem",
        }}
      >
        Casper Photography
      </header>

      {/* Horizontal scrolling gallery */}
      <section
        ref={sectionRef}
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          "align-items": "center",
        }}
      >
        <div
          ref={trackRef}
          style={{ display: "flex", gap: "24px", padding: "0 40px" }}
        >
          <For each={photos()}>
            {(p, idx) => (
              <button
                class="photo-card"
                onClick={() => openPhoto(idx())}
                style={{
                  width: "65vw",
                  height: "70vh",
                  border: "none",
                  padding: "0",
                  background: "#111",
                  "border-radius": "14px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  "flex-shrink": "0",
                }}
              >
                <img
                  src={`${MEDIA_BASE}${p.thumbUrl}`}
                  alt={p.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    "object-fit": "cover",
                    filter: "contrast(1.05)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    bottom: "12px",
                    "text-align": "left",
                    "pointer-events": "none",
                  }}
                >
                  <div style={{ "font-weight": "700" }}>{p.title}</div>
                  <div style={{ opacity: "0.8", "font-size": "0.9rem" }}>
                    {p.description}
                  </div>
                </div>
              </button>
            )}
          </For>
        </div>
      </section>

      {/* Lightbox modal */}
      <Show when={open() && current()}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current()?.title}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: "0",
            background: "rgba(0,0,0,0.88)",
            "z-index": "100",
            display: "grid",
            "place-items": "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "92vw",
              height: "88vh",
              position: "relative",
            }}
          >
            <img
              src={`${MEDIA_BASE}${current()!.fileUrl}`}
              alt={current()!.title}
              style={{
                width: "100%",
                height: "100%",
                "object-fit": "contain",
              }}
            />

            {/* Controls */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExifOpen((v) => !v);
                }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  padding: "6px 12px",
                  "border-radius": "6px",
                  cursor: "pointer",
                  "font-size": "0.85rem",
                }}
              >
                EXIF
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  padding: "6px 12px",
                  "border-radius": "6px",
                  cursor: "pointer",
                  "font-size": "0.85rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Prev / Next */}
            <button
              onClick={prevPhoto}
              aria-label="Previous photo"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                padding: "10px 14px",
                "border-radius": "8px",
                cursor: "pointer",
                "font-size": "1.2rem",
              }}
            >
              ◀
            </button>
            <button
              onClick={nextPhoto}
              aria-label="Next photo"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                padding: "10px 14px",
                "border-radius": "8px",
                cursor: "pointer",
                "font-size": "1.2rem",
              }}
            >
              ▶
            </button>

            {/* EXIF drawer */}
            <Show when={exifOpen() && current()?.exif}>
              <aside
                style={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                  height: "100%",
                  width: "300px",
                  background: "rgba(20,20,20,0.95)",
                  padding: "20px 16px",
                  "border-left": "1px solid rgba(255,255,255,0.15)",
                  "overflow-y": "auto",
                }}
              >
                <h3 style={{ margin: "0 0 16px 0", "font-size": "1rem" }}>
                  EXIF Data
                </h3>
                <dl style={{ margin: "0", display: "grid", gap: "8px" }}>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>Camera</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.camera}</dd>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>Lens</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.lens}</dd>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>Aperture</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.aperture}</dd>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>Shutter</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.shutterSpeed}</dd>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>ISO</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.iso}</dd>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>Focal Length</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.focalLength}</dd>
                  <dt style={{ opacity: "0.6", "font-size": "0.8rem" }}>Location</dt>
                  <dd style={{ margin: "0", "font-size": "0.9rem" }}>{current()!.exif!.location}</dd>
                </dl>
              </aside>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
