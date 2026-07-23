import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/galleries')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/galleries"!</div>
}
