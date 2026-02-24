import { Box, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import { HorizontalNormRangeSlider } from "@/components/ui/internal-slider";
import { useBackwardNormControl } from "./hooks/useBackwardNormControl";

export default function GrismBackwardNormControls() {
	const {
		backwardGlobalNorm,
		setBackwardGlobalNorm,
		backwardRoiNorm,
		setBackwardRoiNorm,
		backwardNormIndependent,
		setBackwardNormIndependent,
		isRoiLoading,
		handleGlobalPSliderChange,
		handleRoiPChange,
	} = useBackwardNormControl();

	/* -------------------------------------------------------------------------- */
	/*                                   Render                                   */
	/* -------------------------------------------------------------------------- */
	return (
		<VStack gap={4} align="stretch">
			{/* Header and Toggle */}
			<HStack justify="space-between">
				<Text
					fontSize="xs"
					fontWeight="bold"
					color="gray.400"
					letterSpacing="wider"
				>
					Grism
				</Text>
				<HStack gap={2}>
					<Text
						fontSize="xs"
						color={backwardNormIndependent ? "teal.300" : "gray.500"}
					>
						ROI Norm: {backwardNormIndependent ? "Local" : "Global"}
					</Text>
					<Switch.Root
						size="sm"
						colorPalette="teal"
						checked={backwardNormIndependent}
						onCheckedChange={(e) => setBackwardNormIndependent(e.checked)}
					>
						<Switch.HiddenInput />
						<Switch.Control>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</HStack>
			</HStack>

			{/* Global Norm Slider */}
			<Box>
				<Text fontSize="xs" color="teal.300" fontWeight="semibold" mb={1}>
					Global Norm
				</Text>
				<HorizontalNormRangeSlider
					pmin={backwardGlobalNorm.pmin}
					pmax={backwardGlobalNorm.pmax}
					vmin={backwardGlobalNorm.vmin}
					vmax={backwardGlobalNorm.vmax}
					onPminChange={(p) => handleGlobalPSliderChange(p, "pmin")}
					onPmaxChange={(p) => handleGlobalPSliderChange(p, "pmax")}
					onVminChange={(v) => setBackwardGlobalNorm({ vmin: v })}
					onVmaxChange={(v) => setBackwardGlobalNorm({ vmax: v })}
				/>
			</Box>

			{/* ROI Norm Slider */}
			<Box>
				<Text
					fontSize="xs"
					color={backwardNormIndependent ? "teal.300" : "gray.500"}
					fontWeight="semibold"
					mb={1}
				>
					ROI Norm {backwardNormIndependent ? "(Active)" : "(Disabled)"}
				</Text>
				<HorizontalNormRangeSlider
					pmin={backwardRoiNorm.pmin}
					pmax={backwardRoiNorm.pmax}
					vmin={backwardRoiNorm.vmin}
					vmax={backwardRoiNorm.vmax}
					onPminChange={(p) => handleRoiPChange(p, "pmin")}
					onPmaxChange={(p) => handleRoiPChange(p, "pmax")}
					onVminChange={(v) => setBackwardRoiNorm({ vmin: v })}
					onVmaxChange={(v) => setBackwardRoiNorm({ vmax: v })}
				/>
			</Box>

			{/* Loading Indicator */}
			<Box h="16px">
				{isRoiLoading && (
					<Text
						fontSize="xs"
						color="cyan.300"
						textAlign="center"
						animation="pulse 1s infinite"
					>
						Updating ROI percentiles...
					</Text>
				)}
			</Box>
		</VStack>
	);
}
