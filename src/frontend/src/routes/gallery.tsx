import { createFileRoute } from "@tanstack/solid-router";
import GalleryPage from "../pages/GalleryPage";

export const Route = createFileRoute("/gallery")({
  component: GalleryRoute,
});

function GalleryRoute() {
  return <GalleryPage galleryId="1" />;
}