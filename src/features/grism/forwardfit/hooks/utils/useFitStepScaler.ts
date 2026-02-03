import { useRef, useState, useEffect, useCallback } from "react";
import type { WaveFrame, WaveUnit } from "@/stores/stores-types";
import { displayFactor } from "@/utils/wavelength";

type StepDictionary = Record<string, number>;

interface UseFitStepScalerProps {
	/** Initial step values (e.g., { k: 0.1, x0: 0.001 }) */
	initialSteps: StepDictionary;
	waveUnit: WaveUnit;
	waveFrame: WaveFrame;
	zRedshift: number;
}

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
