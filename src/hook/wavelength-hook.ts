import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { clamp } from "@/utils/projection";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import {
	displayFactor,
	formatWavelength,
	toDisplayWavelength,
	ANGSTROM_PER_MICRON,
	fromDisplayWavelength,
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

/* -------------------------------------------------------------------------- */
/*                            Hook: Emission Lines                            */
/* -------------------------------------------------------------------------- */

/**
 * Manages the logic for the Emission Lines section:
 * - Adding new lines (with unit conversion)
 * - Removing lines
 * - Toggling selection state
 * - Sorting the list
 */
export function useEmissionLineManager() {
	const {
		waveUnit,
		zRedshift,
		emissionLines,
		selectedEmissionLines,
		addEmissionLine,
		removeEmissionLine,
		setSelectedEmissionLines,
	} = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
			emissionLines: state.emissionLines,
			selectedEmissionLines: state.selectedEmissionLines,
			addEmissionLine: state.addEmissionLine,
			removeEmissionLine: state.removeEmissionLine,
			setSelectedEmissionLines: state.setSelectedEmissionLines,
		})),
	);

	// Local input state
	const [name, setName] = useState("");
	const [wavelengthInput, setWavelengthInput] = useState("");

	// 1. Computed: Sorted lines list
	const sortedLines = useMemo(
		() => Object.entries(emissionLines).sort(([, a], [, b]) => a - b),
		[emissionLines],
	);

	// 2. Computed: Selected keys (for UI sync)
	const [selectedKeys, setSelectedKeys] = useState<string[]>(() =>
		Object.keys(selectedEmissionLines),
	);

	// Sync local selection state when store updates externally
	useEffect(() => {
		setSelectedKeys(Object.keys(selectedEmissionLines));
	}, [selectedEmissionLines]);

	// 3. Validation
	const canAdd =
		name.trim().length > 0 &&
		!Number.isNaN(parseFloat(wavelengthInput)) &&
		!emissionLines[name.trim()];

	// 4. Action: Add Line
	const handleAdd = useCallback(() => {
		if (!canAdd) return;
		const raw = parseFloat(wavelengthInput);
		if (!Number.isFinite(raw)) return;

		// Logic: Input is treated as Rest Frame in the current display unit.
		// If unit is Å, divide by conversion factor to store as µm.
		const wlUm = waveUnit === "µm" ? raw : raw / ANGSTROM_PER_MICRON;

		addEmissionLine(name.trim(), wlUm);

		// Reset inputs
		setName("");
		setWavelengthInput("");
	}, [canAdd, wavelengthInput, waveUnit, addEmissionLine, name]);

	// 5. Action: Toggle Selection
	const toggleSelection = useCallback(
		(lineName: string, isSelected: boolean) => {
			const nextKeys = isSelected
				? Array.from(new Set([...selectedKeys, lineName]))
				: selectedKeys.filter((n) => n !== lineName);

			setSelectedKeys(nextKeys); // Optimistic update

			const nextRecord: Record<string, number> = {};
			nextKeys.forEach((n) => {
				const wl = emissionLines[n];
				if (typeof wl === "number") {
					nextRecord[n] = wl;
				}
			});

			setSelectedEmissionLines(nextRecord);
		},
		[selectedKeys, emissionLines, setSelectedEmissionLines],
	);

	// 6. Action: Remove Line
	const handleRemove = useCallback(
		(lineName: string) => {
			removeEmissionLine(lineName);
		},
		[removeEmissionLine],
	);

	return {
		// Data
		sortedLines,
		selectedKeys,
		waveUnit,
		zRedshift,

		// Inputs
		inputName: name,
		setInputName: setName,
		inputWavelength: wavelengthInput,
		setInputWavelength: setWavelengthInput,
		canAdd,

		// Handlers
		handleAdd,
		handleRemove,
		toggleSelection,
	};
}

/* -------------------------------------------------------------------------- */
/*                             Hook: Slice Range                              */
/* -------------------------------------------------------------------------- */

/**
 * Manages the logic for the 1D Slice Wavelength Range inputs.
 * Handles the bidirectional conversion between:
 * - Store Value (Standard µm)
 * - Display Value (User input based on Unit/Frame/Redshift)
 */
export function useSliceRangeManager() {
	const { slice1DWaveRange, setSlice1DWaveRange, collapseWindow, zRedshift } =
		useGrismStore(
			useShallow((state) => ({
				slice1DWaveRange: state.slice1DWaveRange,
				setSlice1DWaveRange: state.setSlice1DWaveRange,
				collapseWindow: state.collapseWindow,
				zRedshift: state.zRedshift,
			})),
		);

	// Reuse existing hook for display conversion (Read)
	const { converter, waveUnit, waveFrame } = useWavelengthDisplay();

	// Local string state for inputs (allows typing decimals)
	const [minInput, setMinInput] = useState("");
	const [maxInput, setMaxInput] = useState("");

	// 1. Sync: Store -> Local Input (when store updates)
	useEffect(() => {
		const minDisplay = converter(slice1DWaveRange.min);
		const maxDisplay = converter(slice1DWaveRange.max);

		setMinInput(Number.isFinite(minDisplay) ? String(minDisplay) : "");
		setMaxInput(Number.isFinite(maxDisplay) ? String(maxDisplay) : "");
	}, [slice1DWaveRange, converter]);

	// 2. Action: Apply Local Input -> Store (Write)
	const applyRange = useCallback(() => {
		const pMin = parseFloat(minInput);
		const pMax = parseFloat(maxInput);

		if (!Number.isFinite(pMin) || !Number.isFinite(pMax)) return;

		// Convert Display Value -> Store Value (µm)
		let minUm = fromDisplayWavelength(pMin, waveUnit, waveFrame, zRedshift);
		let maxUm = fromDisplayWavelength(pMax, waveUnit, waveFrame, zRedshift);

		// Ensure min < max
		if (minUm > maxUm) {
			const temp = minUm;
			minUm = maxUm;
			maxUm = temp;
		}

		// Clamp within the global extraction window
		const winMin = Math.min(collapseWindow.waveMin, collapseWindow.waveMax);
		const winMax = Math.max(collapseWindow.waveMin, collapseWindow.waveMax);

		minUm = clamp(minUm, winMin, winMax);
		maxUm = clamp(maxUm, minUm, winMax);

		setSlice1DWaveRange({ min: minUm, max: maxUm });
	}, [
		minInput,
		maxInput,
		waveUnit,
		waveFrame,
		zRedshift,
		collapseWindow,
		setSlice1DWaveRange,
	]);

	return {
		// 原始字符串（如果还需要处理复杂输入逻辑）
		minInputStr: minInput, 
		maxInputStr: maxInput,

		// ✨ 新增：专门给 CompactNumberInput 用的数字取值器
		// 如果是空字符串，返回 NaN，CompactNumberInput 会处理为空
		minValue: minInput === "" ? NaN : parseFloat(minInput),
		maxValue: maxInput === "" ? NaN : parseFloat(maxInput),
		
		// ✨ 新增：专门给 CompactNumberInput 用的 Setter
		// 直接接收 number，内部转 string
		setMin: (val: number) => setMinInput(Number.isNaN(val) ? "" : val.toString()),
		setMax: (val: number) => setMaxInput(Number.isNaN(val) ? "" : val.toString()),

		applyRange,
		waveUnit,
	};
}