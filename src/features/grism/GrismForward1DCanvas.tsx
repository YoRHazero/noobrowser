import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import Spectrum1DChart from "@/features/grism/spectrum1d/Spectrum1DChart";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useGrismStore } from "@/stores/image";
import extractFormatted1DSpectrum from "@/utils/extraction";

export default function Grism1DCanvas() {
	const { collapseWindow, spectrumQueryKey } = useGrismStore(
		useShallow((state) => ({
			collapseWindow: state.collapseWindow,
			spectrumQueryKey: state.spectrumQueryKey,
		})),
	);

	const { data: extractSpectrumData } = useQuery<ExtractedSpectrum | undefined>({
		queryKey: spectrumQueryKey ?? ["extract_spectrum", "empty"],
		queryFn: async () => undefined,
		enabled: false,
	});
	const spectrum1D = useMemo(() => {
		if (!extractSpectrumData || !extractSpectrumData.covered) {
			return [];
		}
		return (
			extractFormatted1DSpectrum(extractSpectrumData, collapseWindow, "row") ??
			[]
		);
	}, [extractSpectrumData, collapseWindow]);

	if (spectrum1D.length === 0) {
		return null;
	}
	return (
		<Spectrum1DChart
			spectrum1D={spectrum1D}
			width={900}
			height={700}
			margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
		/>
	);
}
