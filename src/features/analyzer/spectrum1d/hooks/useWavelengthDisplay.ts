import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import {
	displayFactor,
	formatWavelength,
	toDisplayWavelength,
} from "@/utils/wavelength";

/* -------------------------------------------------------------------------- */
/*                          Hook: Wavelength Display                          */
/* -------------------------------------------------------------------------- */
/**
 * Hook to get wavelength display related parameters and functions.
 * Includes unit, frame, conversion factor, and formatters.
 * @return An object containing wavelength display parameters and functions.
 * - waveUnit: The unit for wavelength display ("µm" or "Å") in store.
 * - waveFrame: The frame for wavelength display ("observe" or "rest") in store.
 * - factor: Conversion factor from observed wavelength (µm) to chosen display unit, frame and redshift.
 * - converter: Function to convert observed wavelength (µm) to chosen display unit, frame and redshift.
 * - formatter: Function to format observed wavelength (µm) to string without unit.
 * - formatterWithUnit: Function to format observed wavelength (µm) to string with unit.
 * - label: Label string for wavelength axis.
*/
export function useWavelengthDisplay() {
	const { waveUnit, zRedshift } = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
		})),
	);
	const { waveFrame } = useFitStore(
		useShallow((state) => ({
			waveFrame: state.waveFrame,
		})),
	);

	const factor = displayFactor(waveUnit, waveFrame, zRedshift);
	const converter = (valueObsUm: number) => {
		return toDisplayWavelength(valueObsUm, waveUnit, waveFrame, zRedshift);
	};
	const formatterWithUnit = (valueObsUm: number) => {
		return formatWavelength(valueObsUm, waveUnit, waveFrame, zRedshift);
	};
	const formatter = (valueObsUm: number) => {
		const valueDisplay = toDisplayWavelength(
			valueObsUm,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		const digits = waveUnit === "µm" ? 4 : 0;
		return valueDisplay.toFixed(digits);
	};
	const label = `λ_${waveFrame === "observe" ? "obs" : "rest"} (${waveUnit})`;
	return {
		waveUnit,
		waveFrame,
		factor,
		converter,
		formatter,
		formatterWithUnit,
		label,
	};
}
