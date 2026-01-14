import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import { clamp } from "@/utils/projection";

export function useRedshiftControls() {
	const { zRedshift, setZRedshift } = useGrismStore(
		useShallow((state) => ({
			zRedshift: state.zRedshift,
			setZRedshift: state.setZRedshift,
		})),
	);
	const { displayedTraceSourceId, updateTraceSource } = useSourcesStore(
		useShallow((state) => ({
			displayedTraceSourceId: state.displayedTraceSourceId,
			updateTraceSource: state.updateTraceSource,
		})),
	);

	const updateDisplayedSourceRedshift = useCallback(
		(z: number) => {
			if (!displayedTraceSourceId) return;
			updateTraceSource(displayedTraceSourceId, { z });
		},
		[displayedTraceSourceId, updateTraceSource],
	);

	const [maxRedshift, setMaxRedshift] = useState(12);
	const [step, setStep] = useState(0.001);
	const [localZ, setLocalZ] = useState(zRedshift || 0);

	useEffect(() => {
		setLocalZ(zRedshift || 0);
	}, [zRedshift]);

	const debouncedSetZ = useDebouncedCallback((val: number) => {
		setZRedshift(val);
	}, 10);
	const debouncedSetDisplayedSourceRedshift = useDebouncedCallback(
		(val: number) => {
			updateDisplayedSourceRedshift(val);
		},
		10,
	);

	const safeMax = Math.max(maxRedshift, 0);
	const safeZ = clamp(localZ, 0, safeMax);

	const handleSliderChange = ({ value }: { value: number[] }) => {
		const next = clamp(value[0] ?? 0, 0, safeMax);
		setLocalZ(next);
		debouncedSetZ(next);
		debouncedSetDisplayedSourceRedshift(next);
	};

	const handleZInputChange = (val: number) => {
		const next = clamp(val, 0, safeMax);
		setLocalZ(next);
		debouncedSetZ(next);
		debouncedSetDisplayedSourceRedshift(next);
	};

	return {
		localZ,
		safeZ,
		safeMax,
		step,
		maxRedshift,
		setStep,
		setMaxRedshift,
		handleSliderChange,
		handleZInputChange,
	};
}
