import { useAnalyzerStore } from "@/stores/analyzer";
import { useShallow } from "zustand/react/shallow";

export function useWavelengthControl() {
	const { waveFrame, setWaveFrame } = useAnalyzerStore(
		useShallow((state) => ({
			waveFrame: state.waveFrame,
			setWaveFrame: state.setWaveFrame,
		})),
	);

	const { waveUnit, setWaveUnit } = useAnalyzerStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			setWaveUnit: state.setWaveUnit,
		})),
	);

	return {
		waveFrame,
		setWaveFrame,
		waveUnit,
		setWaveUnit,
	};
}
