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
      <br />
      下面是 Pixi.js 的测试组件：
      <br />
      <MyComponent />
    </div>
  )
}
