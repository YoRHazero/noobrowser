import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";

export function useEmissionLinesManager() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { emissionLines } = useGrismStore(
		useShallow((state) => ({
			emissionLines: state.emissionLines,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const sortedLineIds = useMemo(
		() =>
			Object.entries(emissionLines)
				.sort(([, a], [, b]) => a.wavelength - b.wavelength)
				.map(([id]) => id),
		[emissionLines],
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		sortedLineIds,
	};
}
