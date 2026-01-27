import { Box, HStack, Slider, Switch, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { useEmissionMask } from "@/hooks/query/grism";

/**
 * Plasma colormap function (matches shader)
 * Returns RGB color for normalized value t ∈ [0, 1]
 */
function plasmaColor(t: number): string {
	const c0 = [0.0504, 0.0298, 0.528];
	const c1 = [2.0281, -0.0893, 0.69];
	const c2 = [-2.3053, 3.5714, -2.0145];
	const c3 = [6.8093, -6.0988, 3.1312];
	const c4 = [-5.4094, 4.3636, -1.4507];
	const c5 = [0.8394, -1.431, 0.1674];

	const r =
		c0[0] +
		t * (c1[0] + t * (c2[0] + t * (c3[0] + t * (c4[0] + t * c5[0]))));
	const g =
		c0[1] +
		t * (c1[1] + t * (c2[1] + t * (c3[1] + t * (c4[1] + t * c5[1]))));
	const b =
		c0[2] +
		t * (c1[2] + t * (c2[2] + t * (c3[2] + t * (c4[2] + t * c5[2]))));

	const toHex = (v: number) =>
		Math.round(Math.max(0, Math.min(1, v)) * 255)
			.toString(16)
			.padStart(2, "0");

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

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
			const t = v / maxValue;
			colors.push({ value: v, color: plasmaColor(t) });
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
