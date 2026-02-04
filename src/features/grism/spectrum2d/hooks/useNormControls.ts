
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { percentileFromSortedArray } from "@/utils/plot";
import { clamp } from "@/utils/projection";

export function useNormControls() {
	const {
		grismNorm,
		extractedSpecSortedArray,
		setGrismNorm,
		normInWindow,
		setNormInWindow,
	} = useGrismStore(
		useShallow((state) => ({
			grismNorm: state.grismNorm,
			normInWindow: state.normInWindow,
			extractedSpecSortedArray: state.extractedSpecSortedArray,
			setGrismNorm: state.setGrismNorm,
			setNormInWindow: state.setNormInWindow,
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

	return {
		grismNorm,
		normInWindow,
		handlePminChange,
		handlePmaxChange,
		setGrismNorm,
		setNormInWindow,
	};
}
