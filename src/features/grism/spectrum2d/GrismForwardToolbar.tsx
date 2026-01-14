import { Box, HStack, Separator, Switch } from "@chakra-ui/react";
import { useId } from "react";
import { useShallow } from "zustand/react/shallow";
import { HorizontalNormRangeSlider } from "@/components/ui/internal-slider";
import { Tooltip } from "@/components/ui/tooltip";
import { useGrismStore } from "@/stores/image";
import { percentileFromSortedArray } from "@/utils/plot";
import { clamp } from "@/utils/projection";

export default function GrismForwardToolbar() {
	return (
		<HStack w="100%" h="full" gap={3} px={2} align="center">
			<Box flex={1}>
				<GrismNormSlider />
			</Box>
			<Separator orientation="vertical" h="20px" borderColor="border.muted" />
			<GrismNormSwitch />
		</HStack>
	);
}
/* -------------------------------------------------------------------------- */
/*                                   Slider                                   */
/* -------------------------------------------------------------------------- */

function GrismNormSlider() {
	const { grismNorm, extractedSpecSortedArray, setGrismNorm } = useGrismStore(
		useShallow((state) => ({
			grismNorm: state.grismNorm,
			normInWindow: state.normInWindow,
			extractedSpecSortedArray: state.extractedSpecSortedArray,
			setGrismNorm: state.setGrismNorm,
		})),
	);

	const handlePminChange = (newPmin: number) => {
		const maxAllowed = grismNorm.pmax - 5;
		const pmin = clamp(newPmin, 0, maxAllowed);

		if (extractedSpecSortedArray) {
			const vmin = percentileFromSortedArray(
				extractedSpecSortedArray,
				pmin,
			) as number;
			setGrismNorm({ pmin, vmin });
		} else {
			setGrismNorm({ pmin, vmin: undefined });
		}
	};

	const handlePmaxChange = (newPmax: number) => {
		const minAllowed = grismNorm.pmin + 5;
		const pmax = clamp(newPmax, minAllowed, 100);

		if (extractedSpecSortedArray) {
			const vmax = percentileFromSortedArray(
				extractedSpecSortedArray,
				pmax,
			) as number;
			setGrismNorm({ pmax, vmax });
		} else {
			setGrismNorm({ pmax, vmax: undefined });
		}
	};

	return (
		<HorizontalNormRangeSlider
			pmin={grismNorm.pmin}
			pmax={grismNorm.pmax}
			vmin={grismNorm.vmin}
			vmax={grismNorm.vmax}
			onPminChange={handlePminChange}
			onPmaxChange={handlePmaxChange}
			onVminChange={(v) => setGrismNorm({ vmin: v })}
			onVmaxChange={(v) => setGrismNorm({ vmax: v })}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   Switch                                   */
/* -------------------------------------------------------------------------- */

function GrismNormSwitch() {
	const { normInWindow, setNormInWindow } = useGrismStore(
		useShallow((state) => ({
			normInWindow: state.normInWindow,
			setNormInWindow: state.setNormInWindow,
		})),
	);
	const id = useId();
	return (
		<Tooltip
			ids={{ trigger: id }}
			content={
				normInWindow
					? "Switch to use entire range"
					: "Switch to use current window range"
			}
		>
			<Switch.Root
				ids={{ root: id }}
				checked={normInWindow}
				onCheckedChange={(details) => setNormInWindow(details.checked)}
			>
				<Switch.HiddenInput />
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
			</Switch.Root>
		</Tooltip>
	);
}
