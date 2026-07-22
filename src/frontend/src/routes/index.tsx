import { createFileRoute } from "@tanstack/solid-router";
import { HomePage } from "../App";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return <HomePage />;
}