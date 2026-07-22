import { createFileRoute } from "@tanstack/solid-router";
import AdminLoginPage from "../../pages/AdminLoginPage";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginRoute,
});

function AdminLoginRoute() {
  return <AdminLoginPage />;
}