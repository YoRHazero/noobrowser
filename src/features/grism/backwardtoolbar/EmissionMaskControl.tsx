import { Box, HStack, Slider, Switch, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { useEmissionMask } from "@/hooks/query/image";

import { EMISSION_MASK_COLORS } from "../backward/layers/EmissionMaskLayer";

export default function EmissionMaskControl() {
	const {
		emissionMaskVisible,
		setEmissionMaskVisible,
		emissionMaskThreshold,
		setEmissionMaskThreshold,
	} = useGrismStore(
		useShallow((state) => ({
			emissionMaskVisible: state.emissionMaskVisible,
			setEmissionMaskVisible: state.setEmissionMaskVisible,
			emissionMaskThreshold: state.emissionMaskThreshold,
			setEmissionMaskThreshold: state.setEmissionMaskThreshold,
		})),
	);

	const { data: maskData, isLoading } = useEmissionMask({
		enabled: emissionMaskVisible,
	});

	const maxValue = maskData?.maxValue ?? 10;

	// Generate discrete color legend
	const colorLegend = useMemo(() => {
		const colors: { value: number; color: string }[] = [];
		for (let v = 1; v <= maxValue; v++) {
			const index = (v - 1) % EMISSION_MASK_COLORS.length;
			// Safety check
			const safeIndex =
				index >= 0 ? index : index + EMISSION_MASK_COLORS.length;
			colors.push({ value: v, color: EMISSION_MASK_COLORS[safeIndex] });
		}
		return colors;
	}, [maxValue]);

	return (
		<VStack gap={3} align="stretch">
			{/* Header with visibility toggle */}
			<HStack justify="space-between">
				<Text
					fontSize="xs"
					fontWeight="bold"
					color="gray.400"
					letterSpacing="wider"
				>
					Emission Mask
				</Text>
				<HStack gap={2}>
					<Text
						fontSize="xs"
						color={emissionMaskVisible ? "cyan.400" : "gray.500"}
					>
						{isLoading
							? "Loading..."
							: emissionMaskVisible
								? "Visible"
								: "Hidden"}
					</Text>
					<Switch.Root
						size="sm"
						colorPalette="cyan"
						checked={emissionMaskVisible}
						onCheckedChange={(e) => setEmissionMaskVisible(e.checked)}
					>
						<Switch.HiddenInput />
						<Switch.Control>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</HStack>
			</HStack>

			{/* Threshold Slider and Color Legend - only show when visible */}
			{emissionMaskVisible && (
				<>
					{/* Color Legend */}
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
									opacity={value <= emissionMaskThreshold ? 0.3 : 1}
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

					{/* Threshold Slider */}
					<Box>
						<HStack justify="space-between" mb={1}>
							<Text fontSize="xs" color="cyan.400" fontWeight="semibold">
								Transparency Threshold
							</Text>
							<Text fontSize="xs" color="gray.400" fontFamily="mono">
								≤ {emissionMaskThreshold}
							</Text>
						</HStack>
						<Slider.Root
							size="sm"
							min={0}
							max={Math.max(maxValue - 1, 1)}
							step={1}
							value={[emissionMaskThreshold]}
							onValueChange={(e) => setEmissionMaskThreshold(e.value[0])}
						>
							<Slider.Control>
								<Slider.Track>
									<Slider.Range />
								</Slider.Track>
								<Slider.Thumb index={0} />
							</Slider.Control>
						</Slider.Root>
						<Text fontSize="2xs" color="gray.600" mt={1}>
							Pixels with value ≤ {emissionMaskThreshold} will be transparent
						</Text>
					</Box>
				</>
			)}
		</VStack>
	);
}
