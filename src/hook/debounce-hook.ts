import { useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import { useFluxPercentiles } from "@/hook/connection-hook";
import { useGrismStore } from "@/stores/image";
import type { RoiState } from "@/stores/stores-types";

interface UseDebouncedRoiState {
	debounceMs?: number;
}

export function useDebouncedRoiState({
	debounceMs = 500,
}: UseDebouncedRoiState) {
	const { roiState, pmin, pmax, backwardNormIndependent, setBackwardRoiNorm } =
		useGrismStore(
			useShallow((state) => ({
				roiState: state.roiState,
				pmin: state.backwardRoiNorm.pmin,
				pmax: state.backwardRoiNorm.pmax,
				backwardNormIndependent: state.backwardNormIndependent,
				setBackwardRoiNorm: state.setBackwardRoiNorm,
			})),
		);
	const q = useMemo(() => [pmin, pmax], [pmin, pmax]);

	const [debouncedRoi] = useDebounce<RoiState>(roiState, debounceMs);
	const [debouncedQ] = useDebounce<number[]>(q, debounceMs);

	const fluxPercentilesQuery = useFluxPercentiles({
		q: debouncedQ,
		roi: debouncedRoi,
		enabled: backwardNormIndependent,
	});

	useEffect(() => {
		if (!backwardNormIndependent) return;
		const data = fluxPercentilesQuery.data;
		if (!data) return;
		const percentiles = data.percentiles;
		if (percentiles.length !== 2) return;
		const vmin = percentiles[0];
		const vmax = percentiles[1];
		setBackwardRoiNorm({ vmin, vmax });
	}, [fluxPercentilesQuery.data, backwardNormIndependent, setBackwardRoiNorm]);

	const isDirty =
		roiState !== debouncedRoi ||
		q[0] !== debouncedQ[0] ||
		q[1] !== debouncedQ[1];
	const isLoading =
		backwardNormIndependent && (isDirty || fluxPercentilesQuery.isFetching);
	return {
		fluxPercentilesQuery,
		isDirty,
		isLoading,
	};
}
