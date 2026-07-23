import { createFileRoute } from "@tanstack/solid-router";
import GalleryIndexPage from "../pages/GalleryIndexPage";

export const Route = createFileRoute("/galleries")({
  component: GalleriesRoute,
});

function GalleriesRoute() {
  return <GalleryIndexPage />;
}