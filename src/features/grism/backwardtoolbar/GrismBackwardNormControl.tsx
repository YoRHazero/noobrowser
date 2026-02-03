import { Box, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { HorizontalNormRangeSlider } from "@/components/ui/internal-slider";
import { useFluxPercentiles } from "@/hooks/query/image/useFluxPercentiles";
import { useDebouncedRoiState } from "@/features/grism/hooks/useDebouncedRoiState";
import { useGrismStore } from "@/stores/image";
import type { NormParams } from "@/stores/stores-types";
import { clamp } from "@/utils/projection";

export default function GrismBackwardNormControls() {
	/* -------------------------------------------------------------------------- */
	/*                                Data & Store                                */
	/* -------------------------------------------------------------------------- */
	const { data: globalStats } = useFluxPercentiles({});
	const percentilesCache = globalStats?.percentiles;

	const { isLoading: isRoiLoading } = useDebouncedRoiState({});

	const {
		backwardGlobalNorm,
		setBackwardGlobalNorm,
		backwardRoiNorm,
		setBackwardRoiNorm,
		backwardNormIndependent,
		setBackwardNormIndependent,
	} = useGrismStore(
		useShallow((state) => ({
			backwardGlobalNorm: state.backwardGlobalNorm,
			setBackwardGlobalNorm: state.setBackwardGlobalNorm,
			backwardRoiNorm: state.backwardRoiNorm,
			setBackwardRoiNorm: state.setBackwardRoiNorm,
			backwardNormIndependent: state.backwardNormIndependent,
			setBackwardNormIndependent: state.setBackwardNormIndependent,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                    Logic                                   */
	/* -------------------------------------------------------------------------- */
	const lookupGlobalNorm = useCallback(
		(p: number) => {
			if (!percentilesCache) return null;
			const position = clamp(p * 10, 0, 1000);

			const prevIndex = clamp(Math.floor(position), 0, 1000);
			const nextIndex = clamp(Math.ceil(position), 0, 1000);

			if (prevIndex === nextIndex) {
				return percentilesCache[prevIndex];
			}

			const prevValue = percentilesCache[prevIndex];
			const nextValue = percentilesCache[nextIndex];
			const weight = position - prevIndex;
			return prevValue * (1 - weight) + nextValue * weight;
		},
		[percentilesCache],
	);

	/* -------------------------------------------------------------------------- */
	/*                                  Handlers                                  */
	/* -------------------------------------------------------------------------- */
	const handleGlobalPSliderChange = (newP: number, which: "pmin" | "pmax") => {
		const updates: Partial<NormParams> = { [which]: newP };
		const newV = lookupGlobalNorm(newP);
		if (newV !== null) {
			// Check for null explicitly
			updates[which === "pmin" ? "vmin" : "vmax"] = newV;
		}
		setBackwardGlobalNorm(updates);
	};

	const handleRoiPChange = (newP: number, which: "pmin" | "pmax") => {
		setBackwardRoiNorm({ [which]: newP });
	};

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
