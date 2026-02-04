
// @/features/grism/spectrum1d/hooks/useSpectrum1DData.ts
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useGrismStore } from "@/stores/image";
import extractFormatted1DSpectrum from "@/utils/extraction";

export function useSpectrum1DData() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { collapseWindow, spectrumQueryKey } = useGrismStore(
		useShallow((state) => ({
			collapseWindow: state.collapseWindow,
			spectrumQueryKey: state.spectrumQueryKey,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const { data: extractSpectrumData } = useQuery<ExtractedSpectrum | undefined>({
		queryKey: spectrumQueryKey ?? ["extract_spectrum", "empty"],
		queryFn: async () => undefined,
		enabled: false,
	});

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const spectrum1D = useMemo(() => {
		if (!extractSpectrumData || !extractSpectrumData.covered) {
			return [];
		}
		return (
			extractFormatted1DSpectrum(extractSpectrumData, collapseWindow, "row") ??
			[]
		);
	}, [extractSpectrumData, collapseWindow]);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		spectrum1D,
	};
}
