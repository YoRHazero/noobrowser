import { useCallback, useEffect, useRef, useState } from "react";
import type { WaveFrame, WaveUnit } from "@/stores/stores-types";
import { displayFactor, fromDisplayWavelength } from "@/utils/wavelength";

/* -------------------------------------------------------------------------- */
/*                            Type Definitions                                */
/* -------------------------------------------------------------------------- */

type StepDictionary = Record<string, number>;

interface UseFitStepScalerProps {
	/** Initial step values (e.g., { k: 0.1, x0: 0.001 }) */
	initialSteps: StepDictionary;
	waveUnit: WaveUnit;
	waveFrame: WaveFrame;
	zRedshift: number;
}

interface UseFitRangeClampProps {
	/** Current range of the model */
	modelRange: { min: number; max: number };
	/** Global slice range constraint */
	sliceRange: { min: number; max: number };
	/** Callback to update the model */
	onUpdate: (range: { min: number; max: number }) => void;
}

/* -------------------------------------------------------------------------- */
/*                                Hooks                                       */
/* -------------------------------------------------------------------------- */

/**
 * Automatically scales step values (like x0 step, sigma step) when
 * the Wavelength Unit or Reference Frame changes, preserving the
 * relative user experience.
 */
export function useFitStepScaler(props: UseFitStepScalerProps) {
	const { initialSteps, waveUnit, waveFrame, zRedshift } = props;

	// Maintain a local state of steps for each key
	const [steps, setSteps] = useState<StepDictionary>(initialSteps);

	const prevUnitRef = useRef<WaveUnit>(waveUnit);
	const prevFrameRef = useRef<WaveFrame>(waveFrame);

	useEffect(() => {
		const prevUnit = prevUnitRef.current;
		const prevFrame = prevFrameRef.current;

		// If nothing changed, do nothing
		if (prevUnit === waveUnit && prevFrame === waveFrame) return;

		// Calculate the scaling factor ratio
		const oldFactor = displayFactor(prevUnit, prevFrame, zRedshift);
		const newFactor = displayFactor(waveUnit, waveFrame, zRedshift);

		// Update refs
		prevUnitRef.current = waveUnit;
		prevFrameRef.current = waveFrame;

		if (
			!Number.isFinite(oldFactor) ||
			oldFactor === 0 ||
			!Number.isFinite(newFactor)
		) {
			return;
		}

		const ratio = newFactor / oldFactor;

		// Update all steps by multiplying them by the ratio
		setSteps((prev) => {
			const next = { ...prev };
			for (const key in next) {
				next[key] = next[key] * ratio;
			}
			return next;
		});
	}, [waveUnit, waveFrame, zRedshift]);

	/**
	 * Manually update a specific step value
	 */
	const setSingleStep = useCallback((key: string, value: number) => {
		setSteps((prev) => ({ ...prev, [key]: value }));
	}, []);

	return {
		steps,
		setSingleStep,
	};
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

/**
 * A helper to handle number inputs that represent wavelengths.
 * It converts the display value (what the user types) back to
 * Microns (µm) before calling the update function.
 */
export function useWavelengthUpdate(
	waveUnit: WaveUnit,
	waveFrame: WaveFrame,
	zRedshift: number,
) {
	/**
	 * Returns a handler that takes a raw number input, converts it
	 * from display units to µm, and calls the provided callback.
	 */
	const createHandler = useCallback(
		(callback: (valInMicrons: number) => void) => {
			return (displayValue: number) => {
				if (!Number.isFinite(displayValue)) return;
				const valueInMicrons = fromDisplayWavelength(
					displayValue,
					waveUnit,
					waveFrame,
					zRedshift,
				);
				callback(valueInMicrons);
			};
		},
		[waveUnit, waveFrame, zRedshift],
	);

	return createHandler;
}
