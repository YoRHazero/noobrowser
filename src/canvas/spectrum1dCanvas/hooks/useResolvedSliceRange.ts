import { useCallback, useEffect, useMemo, useState } from "react";
import type { Spectrum1DCanvasWaveRange } from "../api";
import { clampWaveRange } from "../utils/clampWaveRange";

interface SliceRangeState {
	dataRange: Spectrum1DCanvasWaveRange;
	sliceRange: Spectrum1DCanvasWaveRange;
}

function areWaveRangesEqual(
	left: Spectrum1DCanvasWaveRange,
	right: Spectrum1DCanvasWaveRange,
) {
	return left.minUm === right.minUm && left.maxUm === right.maxUm;
}

export function useResolvedSliceRange({
	dataRange,
	sliceRange: controlledSliceRange,
	onSliceRangeChange,
}: {
	dataRange: Spectrum1DCanvasWaveRange;
	sliceRange?: Spectrum1DCanvasWaveRange;
	onSliceRangeChange?: (range: Spectrum1DCanvasWaveRange) => void;
}) {
	const [internalState, setInternalState] = useState<SliceRangeState | null>(
		null,
	);
	const isControlled = controlledSliceRange !== undefined;

	useEffect(() => {
		if (isControlled) {
			return;
		}

		setInternalState((current) => {
			if (current && areWaveRangesEqual(current.dataRange, dataRange)) {
				return current;
			}

			return {
				dataRange,
				sliceRange: dataRange,
			};
		});
	}, [dataRange, isControlled]);

	const sliceRange = useMemo(
		() =>
			clampWaveRange(
				isControlled
					? controlledSliceRange
					: (internalState?.sliceRange ?? dataRange),
				dataRange,
			),
		[controlledSliceRange, dataRange, internalState, isControlled],
	);
	const setSliceRange = useCallback(
		(range: Spectrum1DCanvasWaveRange) => {
			const nextRange = clampWaveRange(range, dataRange);

			if (!isControlled) {
				setInternalState({
					dataRange,
					sliceRange: nextRange,
				});
			}

			onSliceRangeChange?.(nextRange);
		},
		[dataRange, isControlled, onSliceRangeChange],
	);

	return useMemo(
		() => ({
			sliceRange,
			setSliceRange,
		}),
		[setSliceRange, sliceRange],
	);
}
