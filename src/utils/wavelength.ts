// utils/wavelength.ts
import type { WaveFrame, WaveUnit } from "@/stores/stores-types";

export type { WaveUnit, WaveFrame };
export const ANGSTROM_PER_MICRON = 1e4;
export const MICRON_PER_ANGSTROM = 1e-4;
export const SPEED_OF_LIGHT_KM_S = 299792.458;
/**
 * Convert a number to input field string value,
 * rounding to specified number of digits.
 * @param value The number to convert.
 * @param digits The number of decimal digits to round to.
 * @returns The string representation for input field.
 */
export function toInputValue(value: number, digits: number = 6): string {
	if (!Number.isFinite(value)) return "";
	const factor = 10 ** digits;
	const rounded = Math.round(value * factor) / factor;
	return String(rounded);
}

/**
 * Display factor between observed µm and display unit / frame.
 * Used to rescale step sizes when unit/frame changes.
 * @param unit Current wavelength unit.
 * @param frame Current wavelength frame.
 * @param zRedshift Current redshift.
 * @returns The multiplicative factor from observed µm to display value.
 */
export function displayFactor(
	unit: WaveUnit,
	frame: WaveFrame,
	zRedshift: number,
): number {
	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);
	let factor = 1; // base: observed frame, µm

	if (unit === "Å") {
		factor *= ANGSTROM_PER_MICRON;
	}
	if (frame === "rest") {
		factor /= zFactor || 1;
	}

	return factor;
}

/**
 * Convert observed-frame µm value to display value
 * according to current unit + frame.
 * @param valueUm The observed-frame µm value.
 * @param unit Current wavelength unit.
 * @param frame Current wavelength frame.
 * @param zRedshift Current redshift.
 * @returns The converted display value.
 */
export function toDisplayWavelength(
	valueUm: number,
	unit: WaveUnit,
	frame: WaveFrame,
	zRedshift: number,
): number {
	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);
	const frameValueUm = frame === "observe" ? valueUm : valueUm / (zFactor || 1);

	if (unit === "µm") return frameValueUm;
	return frameValueUm * ANGSTROM_PER_MICRON;
}

/**
 * Convert display value (unit + frame) back to observed-frame µm.
 * @param displayValue The display value.
 * @param unit Current wavelength unit.
 * @param frame Current wavelength frame.
 * @param zRedshift Current redshift.
 * @returns The converted observed-frame µm value.
 */
export function fromDisplayWavelength(
	displayValue: number,
	unit: WaveUnit,
	frame: WaveFrame,
	zRedshift: number,
): number {
	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);

	let valueUmInFrame: number;
	if (unit === "µm") {
		valueUmInFrame = displayValue;
	} else {
		valueUmInFrame = displayValue / ANGSTROM_PER_MICRON;
	}

	return frame === "observe" ? valueUmInFrame : valueUmInFrame * (zFactor || 1);
}

/**
 * Format observed-frame µm value into a label string
 * according to current unit + frame.
 * @param valueUm The observed-frame µm value.
 * @param unit Current wavelength unit.
 * @param frame Current wavelength frame.
 * @param zRedshift Current redshift.
 * @param digits Number of decimal digits for µm unit.
 * @returns The formatted wavelength string.
 */
export function formatWavelength(
	valueUm: number,
	unit: WaveUnit,
	frame: WaveFrame,
	zRedshift: number,
	digits: number = 4,
): string {
	const v = toDisplayWavelength(valueUm, unit, frame, zRedshift);
	if (unit === "µm") {
		return `${v.toFixed(digits)} μm`;
	}
	return `${Math.round(v)} Å`;
}

export function findNearestWavelengthIndex(
	wavelengthArray: number[],
	targetWavelength: number,
): { index: number; wavelength: number } | null {
	const n = wavelengthArray.length;
	if (n === 0) return null;

	let left = 0;
	let right = n - 1;

	while (left < right) {
		const mid = (left + right) >> 1;
		if (wavelengthArray[mid] < targetWavelength) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}

	let nearestIndex = left;
	let nearestValue = wavelengthArray[nearestIndex];

	if (nearestIndex > 0) {
		const prevValue = wavelengthArray[nearestIndex - 1];
		if (
			Math.abs(prevValue - targetWavelength) <=
			Math.abs(nearestValue - targetWavelength)
		) {
			nearestIndex = nearestIndex - 1;
			nearestValue = prevValue;
		}
	}

	return { index: nearestIndex, wavelength: nearestValue };
}
