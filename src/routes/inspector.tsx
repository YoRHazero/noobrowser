import { createFileRoute } from '@tanstack/react-router'
import { VStack } from '@chakra-ui/react'
import Footprint from '@/components/pixi/Footprint'


export const Route = createFileRoute('/inspector')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <VStack align="start" p={4} gap={4} height="100%" overflow="auto">
      <Footprint />
    </VStack>
  )
}
