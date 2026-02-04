import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useFluxPercentiles } from "@/hooks/query/image/useFluxPercentiles";
import { useDebouncedRoiState } from "@/features/grism/hooks/useDebouncedRoiState";
import { useGrismStore } from "@/stores/image";
import type { NormParams } from "@/stores/stores-types";
import { clamp } from "@/utils/projection";

export function useBackwardNormControl() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
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
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const { data: globalStats } = useFluxPercentiles({});
	const percentilesCache = globalStats?.percentiles;
	const { isLoading: isRoiLoading } = useDebouncedRoiState({});

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
	/*                                   Handle                                   */
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
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		backwardGlobalNorm,
		setBackwardGlobalNorm,
		backwardRoiNorm,
		setBackwardRoiNorm,
		backwardNormIndependent,
		setBackwardNormIndependent,
		isRoiLoading,
		handleGlobalPSliderChange,
		handleRoiPChange,
	};
}
