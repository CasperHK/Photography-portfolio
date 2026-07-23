import { createFileRoute } from "@tanstack/solid-router";
import GalleryPage from "../../../../pages/GalleryPage";

export const Route = createFileRoute("/gallery/$galleryId/photo/$photoId")({
  component: PhotoDetailRoute,
});

function PhotoDetailRoute() {
  const params = Route.useParams();

  return <GalleryPage galleryId={params().galleryId} photoId={params().photoId} />;
}
