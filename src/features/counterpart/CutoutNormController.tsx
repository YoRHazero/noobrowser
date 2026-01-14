import { Box } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { VerticalNormRangeSlider } from "@/components/ui/independent-norm-slider";
import { useCounterpartStore } from "@/stores/image";
import { percentileFromSortedArray } from "@/utils/plot";
import { clamp } from "@/utils/projection";

export default function CuroutNormControler() {
	const { cutoutNorm, setCutoutNorm, cutoutSortedArray } = useCounterpartStore(
		useShallow((state) => ({
			cutoutNorm: state.cutoutNorm,
			setCutoutNorm: state.setCutoutNorm,
			cutoutSortedArray: state.cutoutSortedArray,
		})),
	);

	const handleCutoutPminChange = (next: number) => {
		const maxAllowedCutoutPmin = cutoutNorm.pmax - 5;
		const clampedValue = clamp(next, 0, maxAllowedCutoutPmin);

		if (cutoutSortedArray) {
			const newVmin = percentileFromSortedArray(
				cutoutSortedArray,
				clampedValue,
				true,
			) as number;
			setCutoutNorm({ pmin: clampedValue, vmin: newVmin });
		} else {
			setCutoutNorm({ pmin: clampedValue, vmin: undefined });
		}
	};

	const handleCutoutPmaxChange = (next: number) => {
		const minAllowedCutoutPmax = cutoutNorm.pmin + 5;
		const clampedValue = clamp(next, minAllowedCutoutPmax, 100);

		if (cutoutSortedArray) {
			const newVmax = percentileFromSortedArray(
				cutoutSortedArray,
				clampedValue,
				true,
			) as number;
			setCutoutNorm({ pmax: clampedValue, vmax: newVmax });
		} else {
			setCutoutNorm({ pmax: clampedValue, vmax: undefined });
		}
	};

	return (
		<Box h="600px" w="90px">
			<VerticalNormRangeSlider
				pmin={cutoutNorm.pmin}
				pmax={cutoutNorm.pmax}
				vmin={cutoutNorm.vmin}
				vmax={cutoutNorm.vmax}
				onPminChange={handleCutoutPminChange}
				onPmaxChange={handleCutoutPmaxChange}
				onVminChange={(v) => setCutoutNorm({ vmin: v })}
				onVmaxChange={(v) => setCutoutNorm({ vmax: v })}
			/>
		</Box>
	);
}
