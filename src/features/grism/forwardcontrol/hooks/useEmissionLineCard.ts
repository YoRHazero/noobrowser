import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { ANGSTROM_PER_MICRON } from "@/utils/wavelength";

export function useEmissionLineCard(emissionName: string) {
	const {
		waveUnit,
		zRedshift,
		emissionLines,
		selectedEmissionLines,
		setSelectedEmissionLines,
		removeEmissionLine,
	} = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
			emissionLines: state.emissionLines,
			selectedEmissionLines: state.selectedEmissionLines,
			setSelectedEmissionLines: state.setSelectedEmissionLines,
			removeEmissionLine: state.removeEmissionLine,
		})),
	);

	const isSelected = Object.hasOwn(selectedEmissionLines, emissionName);

	const formatted = useMemo(() => {
		const restUm = emissionLines[emissionName];
		const isMicron = waveUnit === "µm";
		const unit = isMicron ? "μm" : "Å";
		const digits = isMicron ? 4 : 1;
		const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);

		if (!Number.isFinite(restUm)) {
			return { rest: "-", obs: "-", unit };
		}

		const restValNum = isMicron ? restUm : restUm * ANGSTROM_PER_MICRON;
		const obsValNum = restUm * zFactor * (isMicron ? 1 : ANGSTROM_PER_MICRON);

		return {
			rest: restValNum.toFixed(digits),
			obs: obsValNum.toFixed(digits),
			unit,
		};
	}, [emissionLines, emissionName, waveUnit, zRedshift]);

	const toggleSelected = (checked: boolean) => {
		const next = { ...selectedEmissionLines };
		if (checked) {
			const value = emissionLines[emissionName];
			if (Number.isFinite(value)) {
				next[emissionName] = value;
			}
		} else {
			delete next[emissionName];
		}
		setSelectedEmissionLines(next);
	};

	const remove = () => {
		removeEmissionLine(emissionName);
	};

	return {
		name: emissionName,
		isSelected,
		rest: formatted.rest,
		obs: formatted.obs,
		unit: formatted.unit,
		toggleSelected,
		remove,
	};
}
