import { createFileRoute } from "@tanstack/solid-router";
import ContactMePage from "../pages/ContactMePage";

export const Route = createFileRoute("/contact-me")({
  component: ContactMeRoute,
});

function ContactMeRoute() {
  return <ContactMePage />;
}
