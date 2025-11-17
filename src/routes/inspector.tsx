import { createFileRoute } from '@tanstack/react-router'
import { VStack } from '@chakra-ui/react'
import Footprint from '@/components/pixi/Footprint'
import Counterpart from '@/components/pixi/Counterpart'

export const Route = createFileRoute('/inspector')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <VStack align="start" p={4} gap={4} gapY={20} height="100%" overflow="auto">
      <Footprint />
      <Counterpart />
    </VStack>
  )
}
