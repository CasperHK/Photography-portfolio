import { createFileRoute } from "@tanstack/solid-router";
import GalleryPage from "../../pages/GalleryPage";

export const Route = createFileRoute("/gallery/$galleryId")({
  component: GalleryDetailRoute,
});

function GalleryDetailRoute() {
  const params = Route.useParams();

  return <GalleryPage galleryId={params().galleryId} />;
}
