import { createFileRoute } from "@tanstack/solid-router";
import { GalleryPage } from "../App";

export const Route = createFileRoute("/gallery")({
  component: GalleryRoute,
});

function GalleryRoute() {
  return <GalleryPage />;
}