import { createFileRoute } from "@tanstack/solid-router";
import { AboutPage } from "../App";

export const Route = createFileRoute("/about")({
  component: AboutRoute,
});

function AboutRoute() {
  return <AboutPage />;
}