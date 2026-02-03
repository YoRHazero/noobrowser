import { useCallback } from "react";
import type { WaveFrame, WaveUnit } from "@/stores/stores-types";
import { fromDisplayWavelength } from "@/utils/wavelength";

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
