import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";

export function useEmissionLinesManager() {
	const { emissionLines } = useGrismStore(
		useShallow((state) => ({
			emissionLines: state.emissionLines,
		})),
	);

	const sortedLineKeys = useMemo(
		() =>
			Object.entries(emissionLines)
				.sort(([, a], [, b]) => a - b)
				.map(([name]) => name),
		[emissionLines],
	);

	return {
		sortedLineKeys,
	};
}
