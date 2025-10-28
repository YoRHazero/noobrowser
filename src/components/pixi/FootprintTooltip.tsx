import { useGlobeStore } from "@/stores/footprints";
import { Box } from "@chakra-ui/react";

export default function FootprintTooltip() {
  const hoveredFootprintId = useGlobeStore((state) => state.hoveredFootprintId);
  const position = useGlobeStore((state) => state.hoveredFootprintMousePosition);

  if (!hoveredFootprintId || !position) {
    return null;
  }

  return (
    <Box
      position="absolute"
      top={`${position.y + 15}px`}
      left={`${position.x + 15}px`}
      bg="gray.700"
      color="white"
      px="2"
      py="1"
      rounded="md"
      fontSize="sm"
      zIndex="tooltip"
      pointerEvents="none" // So it doesn't interfere with mouse events on the canvas
    >
      ID: {hoveredFootprintId}
    </Box>
  );
}
