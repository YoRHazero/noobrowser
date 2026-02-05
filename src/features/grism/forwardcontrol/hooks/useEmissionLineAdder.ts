import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import {
	ANGSTROM_PER_MICRON,
	generateEmissionLineId,
} from "@/utils/wavelength";

export function useEmissionLineAdder() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { waveUnit, emissionLines, addEmissionLine } = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			emissionLines: state.emissionLines,
			addEmissionLine: state.addEmissionLine,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [name, setName] = useState("");
	const [wavelengthInput, setWavelengthInput] = useState("");

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	// Calculate ID to check duplication
	const rawWavelength = parseFloat(wavelengthInput);
	const targetWavelengthMicron =
		Number.isFinite(rawWavelength) && waveUnit !== "µm"
			? rawWavelength / ANGSTROM_PER_MICRON
			: rawWavelength;

	const generatedId =
		name.trim().length > 0 && Number.isFinite(targetWavelengthMicron)
			? generateEmissionLineId(name.trim(), targetWavelengthMicron)
			: null;

	const canAdd =
		generatedId !== null &&
		!Object.hasOwn(emissionLines, generatedId) &&
		name.trim().length > 0 &&
		!Number.isNaN(rawWavelength);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleAdd = useCallback(() => {
		if (!canAdd) return;
		const raw = parseFloat(wavelengthInput);
		if (!Number.isFinite(raw)) return;

		const wlUm = waveUnit === "µm" ? raw : raw / ANGSTROM_PER_MICRON;
		addEmissionLine(name.trim(), wlUm);

		setName("");
		setWavelengthInput("");
	}, [canAdd, wavelengthInput, waveUnit, addEmissionLine, name]);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		waveUnit,
		inputName: name,
		setInputName: setName,
		inputWavelength: wavelengthInput,
		setInputWavelength: setWavelengthInput,
		canAdd,
		handleAdd,
	};
}
