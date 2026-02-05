import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { ANGSTROM_PER_MICRON } from "@/utils/wavelength";

export function useEmissionLineCard(emissionId: string) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
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

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const isSelected = Object.hasOwn(selectedEmissionLines, emissionId);
	const line = emissionLines[emissionId];

	const formatted = useMemo(() => {
		if (!line) {
			return { rest: "-", obs: "-", unit: waveUnit === "µm" ? "μm" : "Å" };
		}

		const restUm = line.wavelength;
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
	}, [line, waveUnit, zRedshift]);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const toggleSelected = (checked: boolean) => {
		const next = { ...selectedEmissionLines };
		if (checked) {
			if (line) {
				next[emissionId] = line;
			}
		} else {
			delete next[emissionId];
		}
		setSelectedEmissionLines(next);
	};

	const remove = () => {
		removeEmissionLine(emissionId);
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		name: line?.name ?? emissionId,
		isSelected,
		rest: formatted.rest,
		obs: formatted.obs,
		unit: formatted.unit,
		toggleSelected,
		remove,
	};
}
