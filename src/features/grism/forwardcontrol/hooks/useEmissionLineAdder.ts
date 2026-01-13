import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { ANGSTROM_PER_MICRON } from "@/utils/wavelength";

export function useEmissionLineAdder() {
	const { waveUnit, emissionLines, addEmissionLine } = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			emissionLines: state.emissionLines,
			addEmissionLine: state.addEmissionLine,
		})),
	);

	const [name, setName] = useState("");
	const [wavelengthInput, setWavelengthInput] = useState("");

	const canAdd =
		name.trim().length > 0 &&
		!Number.isNaN(parseFloat(wavelengthInput)) &&
		!emissionLines[name.trim()];

	const handleAdd = useCallback(() => {
		if (!canAdd) return;
		const raw = parseFloat(wavelengthInput);
		if (!Number.isFinite(raw)) return;

		const wlUm = waveUnit === "µm" ? raw : raw / ANGSTROM_PER_MICRON;
		addEmissionLine(name.trim(), wlUm);

		setName("");
		setWavelengthInput("");
	}, [canAdd, wavelengthInput, waveUnit, addEmissionLine, name]);

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
