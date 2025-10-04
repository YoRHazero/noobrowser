import { createFileRoute } from '@tanstack/react-router'
import { useConnectionStore } from '@/stores/connection'
import MyComponent from '@/components/pixi/pixitest'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const { backendUrl, username } = useConnectionStore()
  return (
    <div>
      Hello "/test"! Current configuration: {backendUrl || 'Not set'} · {username || 'Anonymous'}
      <MyComponent />
    </div>
  )
}
