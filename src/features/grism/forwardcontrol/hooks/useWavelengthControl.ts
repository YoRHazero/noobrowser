import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";

export function useWavelengthControl() {
	const { waveFrame, setWaveFrame } = useFitStore(
		useShallow((state) => ({
			waveFrame: state.waveFrame,
			setWaveFrame: state.setWaveFrame,
		})),
	);

	const { waveUnit, setWaveUnit } = useGrismStore(
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
