import { Box, HStack, Text } from "@chakra-ui/react";
import { EMISSION_MASK_COLORS } from "@/features/grism/backward/layers/EmissionMaskLayer";

interface EmissionMaskColorLegendProps {
	frameCount: number;
	threshold?: number;
}

export default function EmissionMaskColorLegend({
	frameCount,
	threshold = -1,
}: EmissionMaskColorLegendProps) {
	// Generate discrete color legend
	const colorLegend = (() => {
		const count = frameCount;
		const colors: { value: number; color: string }[] = [];
		for (let v = 1; v <= count; v++) {
			const index = (v - 1) % EMISSION_MASK_COLORS.length;
			// Safety check
			const safeIndex =
				index >= 0 ? index : index + EMISSION_MASK_COLORS.length;
			colors.push({ value: v, color: EMISSION_MASK_COLORS[safeIndex] });
		}
		return colors;
	})();

	return (
		<Box>
			<Text fontSize="xs" color="cyan.400" fontWeight="semibold" mb={1}>
				Color Legend (frames count)
			</Text>
			<HStack gap={1} flexWrap="wrap">
				{colorLegend.map(({ value, color }) => (
					<HStack
						key={value}
						gap={1}
						px={1.5}
						py={0.5}
						borderRadius="sm"
						bg="whiteAlpha.100"
						opacity={value <= threshold ? 0.3 : 1}
					>
						<Box
							w="12px"
							h="12px"
							borderRadius="sm"
							bg={color}
							border="1px solid"
							borderColor="whiteAlpha.300"
						/>
						<Text fontSize="2xs" fontFamily="mono" color="gray.300">
							{value}
						</Text>
					</HStack>
				))}
			</HStack>
		</Box>
	);
}
