import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/gallery/$galleryId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gallery/$galleryId"!</div>
}
