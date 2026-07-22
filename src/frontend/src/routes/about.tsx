import { createFileRoute } from "@tanstack/solid-router";
import AboutPage from "../pages/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutRoute,
});

function AboutRoute() {
  return <AboutPage />;
}