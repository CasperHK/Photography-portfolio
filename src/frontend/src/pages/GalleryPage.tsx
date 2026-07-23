import { Link, useNavigate } from "@tanstack/solid-router";
import { createEffect, createMemo, createSignal, For, onMount } from "solid-js";
import PageFrame from "../components/PageFrame";
import ScrollTopButton from "../components/buttons/ScrollTopButton";
import PhotoViewer from "../components/dialogs/PhotoViewer";
import ShareDialog from "../components/dialogs/ShareDialog";
import {
  FORCE_DEMO_PHOTOS_BY_ENV,
  createDemoPhotos,
  getGalleryById,
  loadPortfolioPhotos,
  toMediaUrl,
  type Photo,
} from "./PortfolioShared";

type GalleryPageProps = {
  galleryId: string;
  photoId?: string;
};

export default function GalleryPage(props: GalleryPageProps) {
  const [photos, setPhotos] = createSignal<Photo[]>([]);
  const [activePhoto, setActivePhoto] = createSignal<Photo | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = createSignal(false);
  const [shareUrl, setShareUrl] = createSignal("");
  const [galleryScrollEl, setGalleryScrollEl] = createSignal<HTMLElement | null>(null);
  const navigate = useNavigate();

  const gallery = createMemo(() => getGalleryById(props.galleryId));
  const hasGallery = createMemo(() => gallery() !== null);
  const activeGalleryId = createMemo(() => gallery()?.id ?? "1");

  onMount(() => {
    const query = new URLSearchParams(window.location.search);
    const forceDemoByQuery = query.get("demo") === "1";
    const forceDemoPhotos = FORCE_DEMO_PHOTOS_BY_ENV || forceDemoByQuery;

    void (async () => {
      if (forceDemoPhotos) {
        setPhotos(createDemoPhotos(30));
        return;
      }

      setPhotos(await loadPortfolioPhotos(30));
    })();
  });

  const hasPhotos = createMemo(() => photos().length > 0);

  createEffect(() => {
    if (!props.photoId) {
      setActivePhoto(null);
      return;
    }

    const parsedPhotoId = Number(props.photoId);
    if (!Number.isFinite(parsedPhotoId)) {
      setActivePhoto(null);
      return;
    }

    setActivePhoto(photos().find((photo) => photo.id === parsedPhotoId) ?? null);
  });

  const openViewer = (photo: Photo, event: MouseEvent) => {
    event.preventDefault();
    setActivePhoto(photo);

    void navigate({
      to: "/gallery/$galleryId/photo/$photoId",
      params: { galleryId: activeGalleryId(), photoId: String(photo.id) },
    });
  };

  const closeViewer = () => {
    setActivePhoto(null);
    void navigate({
      to: "/gallery/$galleryId",
      params: { galleryId: activeGalleryId() },
    });
  };

  const openShareDialog = () => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    } else {
      setShareUrl(`/gallery/${activeGalleryId()}`);
    }

    setIsShareDialogOpen(true);
  };

  const closeShareDialog = () => {
    setIsShareDialogOpen(false);
  };

  const renderTiles = () => (
    <For each={photos()}>
      {(photo) => (
        <Link
          class="gallery-photo"
          to="/gallery/$galleryId/photo/$photoId"
          params={{ galleryId: activeGalleryId(), photoId: String(photo.id) }}
          aria-label={`Open details for ${photo.title}`}
          onClick={(event) => openViewer(photo, event)}
        >
          <img src={toMediaUrl(photo.thumbUrl)} alt={photo.title} loading="lazy" />
          <span class="gallery-photo-label">{photo.title}</span>
        </Link>
      )}
    </For>
  );

  if (!hasGallery()) {
    return (
      <PageFrame title="Gallery" subtitle="This gallery could not be found.">
        <section class="gallery-layout" aria-label="Gallery not found">
          <aside class="gallery-sidebar">
            <p class="gallery-kicker">Archive</p>
            <h2>Not Found</h2>
            <p class="gallery-summary">
              This gallery identifier is not available yet. Try gallery 1.
            </p>
          </aside>
        </section>
      </PageFrame>
    );
  }

  return (
    <PageFrame title={gallery()!.title} subtitle={gallery()!.subtitle}>
      <section class="gallery-layout" aria-label="Portfolio gallery">
        <aside class="gallery-sidebar">
          <p class="gallery-kicker">{gallery()!.kicker}</p>
          <h2>{gallery()!.title}</h2>
          <p class="gallery-summary">{gallery()!.summary}</p>
          <button
            type="button"
            class="gallery-share-trigger"
            aria-label={`Share ${gallery()!.title}`}
            onClick={openShareDialog}
          >
            Share
          </button>
          <div class="gallery-meta">
            <span>{photos().length || 30} frames</span>
            <span>Click for details</span>
          </div>
          <ul class="gallery-notes" aria-label="Gallery notes">
            <For each={gallery()!.notes}>{(note) => <li>{note}</li>}</For>
          </ul>
        </aside>

        <div class="gallery-content">
          <section
            class="gallery-grid-shell"
            aria-label="Portfolio gallery stream"
            ref={setGalleryScrollEl}
          >
            <div class="gallery-grid" data-ready={hasPhotos() ? "true" : "false"}>
              {renderTiles()}
            </div>
          </section>
        </div>
      </section>

      <ScrollTopButton target={galleryScrollEl()} showAfter={140} ariaLabel="Scroll gallery to top" />
      <PhotoViewer
        open={!!activePhoto()}
        photo={activePhoto()}
        galleryTitle={gallery()!.title}
        onClose={closeViewer}
      />
      <ShareDialog
        open={isShareDialogOpen()}
        shareUrl={shareUrl()}
        galleryTitle={gallery()!.title}
        onClose={closeShareDialog}
      />
    </PageFrame>
  );
}
