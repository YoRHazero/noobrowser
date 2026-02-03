import { useCallback } from "react";

interface UseFitRangeClampProps {
	/** Current range of the model */
	modelRange: { min: number; max: number };
	/** Global slice range constraint */
	sliceRange: { min: number; max: number };
	/** Callback to update the model */
	onUpdate: (range: { min: number; max: number }) => void;
}

/**
 * Handles the logic for clamping model range (min/max) within the
 * global slice range. It ensures min < max and both are within bounds.
 */
export function useFitRangeClamp(props: UseFitRangeClampProps) {
	const { modelRange, sliceRange, onUpdate } = props;

	/**
	 * Clamps the minimum value (x1) on blur.
	 * Logic: min must be >= slice.min and <= min(model.max, slice.max)
	 */
	const clampMinOnBlur = useCallback(() => {
		const { min, max } = modelRange;
		const { min: sliceMin, max: sliceMax } = sliceRange;

		if (!Number.isFinite(min)) return;

		const upper = Number.isFinite(max) ? max : sliceMax;
		// Constrain min between sliceMin and the current upper bound
		const clampedMin = Math.min(
			Math.max(min, sliceMin),
			Math.min(upper, sliceMax),
		);

		if (clampedMin !== min) {
			onUpdate({ min: clampedMin, max });
		}
	}, [modelRange, sliceRange, onUpdate]);

	/**
	 * Clamps the maximum value (x2) on blur.
	 * Logic: max must be <= slice.max and >= max(model.min, slice.min)
	 */
	const clampMaxOnBlur = useCallback(() => {
		const { min, max } = modelRange;
		const { min: sliceMin, max: sliceMax } = sliceRange;

		if (!Number.isFinite(max)) return;

		const lower = Number.isFinite(min) ? min : sliceMin;
		// Constrain max between sliceMax and the current lower bound
		const clampedMax = Math.max(
			Math.min(max, sliceMax),
			Math.max(lower, sliceMin),
		);

		if (clampedMax !== max) {
			onUpdate({ min, max: clampedMax });
		}
	}, [modelRange, sliceRange, onUpdate]);

	return {
		clampMinOnBlur,
		clampMaxOnBlur,
	};
}
