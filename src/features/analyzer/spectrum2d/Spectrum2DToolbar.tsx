
import { Box, HStack, Separator, Switch } from "@chakra-ui/react";
import { useId } from "react";
import { HorizontalNormRangeSlider } from "@/components/ui/internal-slider";
import { Tooltip } from "@/components/ui/tooltip";
import { useNormControls } from "./hooks/useNormControls";

export default function Spectrum2DToolbar() {
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
	const { grismNorm, handlePminChange, handlePmaxChange, setGrismNorm } =
		useNormControls();

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
	const { normInWindow, setNormInWindow } = useNormControls();
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
