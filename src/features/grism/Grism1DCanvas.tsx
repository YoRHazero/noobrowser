import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Spectrum1DChart from "@/features/grism/Spectrum1DChart";
import { useExtractSpectrum } from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import extractFormatted1DSpectrum from "@/utils/extraction";

export default function Grism1DCanvas() {
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
	const {
		forwardWaveRange,
		apertureSize,
		collapseWindow,
	} = useGrismStore(
		useShallow((state) => ({
			forwardWaveRange: state.forwardWaveRange,
			apertureSize: state.apertureSize,
			collapseWindow: state.collapseWindow,
		})),
	);

	const { data: extractSpectrumData } = useExtractSpectrum({
		selectedFootprintId,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
		cutoutParams,
		apertureSize,
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
