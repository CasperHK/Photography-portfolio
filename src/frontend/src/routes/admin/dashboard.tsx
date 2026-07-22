import { createFileRoute } from "@tanstack/solid-router";
import BashbaordPage from "../../pages/BashbaordPage";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
  return <BashbaordPage />;
}