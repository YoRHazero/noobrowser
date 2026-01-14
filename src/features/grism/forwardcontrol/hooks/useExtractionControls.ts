import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import { clamp } from "@/utils/projection";
import {
	formatWavelength,
	fromDisplayWavelength,
	toDisplayWavelength,
} from "@/utils/wavelength";

export function useExtractionControls() {
	const {
		collapseWindow,
		setCollapseWindow,
		showTraceOnSpectrum2D,
		switchShowTraceOnSpectrum2D,
		waveUnit,
		zRedshift,
		slice1DWaveRange,
		setSlice1DWaveRange,
		spectrumQueryKey,
	} = useGrismStore(
		useShallow((state) => ({
			collapseWindow: state.collapseWindow,
			setCollapseWindow: state.setCollapseWindow,
			showTraceOnSpectrum2D: state.showTraceOnSpectrum2D,
			switchShowTraceOnSpectrum2D: state.switchShowTraceOnSpectrum2D,
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
			slice1DWaveRange: state.slice1DWaveRange,
			setSlice1DWaveRange: state.setSlice1DWaveRange,
			spectrumQueryKey: state.spectrumQueryKey,
		})),
	);
	const { waveFrame } = useFitStore(
		useShallow((state) => ({
			waveFrame: state.waveFrame,
		})),
	);

	const formatterWithUnit = useCallback(
		(valueObsUm: number) =>
			formatWavelength(valueObsUm, waveUnit, waveFrame, zRedshift),
		[waveUnit, waveFrame, zRedshift],
	);
	const converter = useCallback(
		(valueObsUm: number) =>
			toDisplayWavelength(valueObsUm, waveUnit, waveFrame, zRedshift),
		[waveUnit, waveFrame, zRedshift],
	);
	const [minInput, setMinInput] = useState("");
	const [maxInput, setMaxInput] = useState("");

	useEffect(() => {
		const minDisplay = converter(slice1DWaveRange.min);
		const maxDisplay = converter(slice1DWaveRange.max);

		setMinInput(Number.isFinite(minDisplay) ? String(minDisplay) : "");
		setMaxInput(Number.isFinite(maxDisplay) ? String(maxDisplay) : "");
	}, [slice1DWaveRange, converter]);

	const applySliceRange = useCallback(() => {
		const pMin = parseFloat(minInput);
		const pMax = parseFloat(maxInput);

		if (!Number.isFinite(pMin) || !Number.isFinite(pMax)) return;

		let minUm = fromDisplayWavelength(pMin, waveUnit, waveFrame, zRedshift);
		let maxUm = fromDisplayWavelength(pMax, waveUnit, waveFrame, zRedshift);

		if (minUm > maxUm) {
			const temp = minUm;
			minUm = maxUm;
			maxUm = temp;
		}

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

	const sliceManager = useMemo(
		() => ({
			minInputStr: minInput,
			maxInputStr: maxInput,
			minValue: minInput === "" ? NaN : parseFloat(minInput),
			maxValue: maxInput === "" ? NaN : parseFloat(maxInput),
			setMin: (val: number) =>
				setMinInput(Number.isNaN(val) ? "" : val.toString()),
			setMax: (val: number) =>
				setMaxInput(Number.isNaN(val) ? "" : val.toString()),
			applyRange: applySliceRange,
			waveUnit,
		}),
		[minInput, maxInput, applySliceRange, waveUnit],
	);

	const { data: extractSpectrumData } = useQuery<ExtractedSpectrum | undefined>(
		{
			queryKey: spectrumQueryKey ?? ["extract_spectrum", "empty"],
			queryFn: async () => undefined,
			enabled: false,
		},
	);

	const wavelength = extractSpectrumData?.wavelength ?? [];
	const hasSpectrum = wavelength.length > 0;

	const dataLimits = useMemo(() => {
		if (!hasSpectrum) {
			return {
				waveMin: collapseWindow.waveMin ?? 0,
				waveMax: collapseWindow.waveMax ?? 0,
				spatialMax: Math.max(collapseWindow.spatialMax, 0),
			};
		}
		const wMin = wavelength[0];
		const wMax = wavelength[wavelength.length - 1];
		const rows = extractSpectrumData?.spectrum_2d?.length ?? 0;

		return {
			waveMin: Math.min(wMin, wMax),
			waveMax: Math.max(wMin, wMax),
			spatialMax: rows > 0 ? rows - 1 : 0,
		};
	}, [
		hasSpectrum,
		wavelength,
		extractSpectrumData?.spectrum_2d,
		collapseWindow,
	]);

	const [localWaveRange, setLocalWaveRange] = useState([
		collapseWindow.waveMin,
		collapseWindow.waveMax,
	]);
	const [localSpatialRange, setLocalSpatialRange] = useState([
		collapseWindow.spatialMin,
		collapseWindow.spatialMax,
	]);

	useEffect(() => {
		setLocalWaveRange([collapseWindow.waveMin, collapseWindow.waveMax]);
		setLocalSpatialRange([
			collapseWindow.spatialMin,
			collapseWindow.spatialMax,
		]);
	}, [collapseWindow]);

	const debouncedSetCollapseWindow = useDebouncedCallback(
		(updates: Partial<typeof collapseWindow>) => setCollapseWindow(updates),
		20,
	);

	const handleWaveSliderChange = ({ value }: { value: number[] }) => {
		if (!hasSpectrum) return;
		const [minRaw, maxRaw] = value;
		const safeMin = clamp(minRaw, dataLimits.waveMin, dataLimits.waveMax);
		const safeMax = clamp(maxRaw, safeMin, dataLimits.waveMax);
		setLocalWaveRange([safeMin, safeMax]);
		debouncedSetCollapseWindow({ waveMin: safeMin, waveMax: safeMax });
	};

	const handleSpatialSliderChange = ({ value }: { value: number[] }) => {
		if (!hasSpectrum) return;
		const [minRaw, maxRaw] = value;
		const safeMin = clamp(minRaw, 0, dataLimits.spatialMax);
		const safeMax = clamp(maxRaw, safeMin, dataLimits.spatialMax);
		setLocalSpatialRange([safeMin, safeMax]);
		debouncedSetCollapseWindow({ spatialMin: safeMin, spatialMax: safeMax });
	};

	const handleSliceContainerKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") sliceManager.applyRange();
	};

	return {
		localWaveRange,
		localSpatialRange,
		dataLimits,
		hasSpectrum,
		waveUnit,
		formatterWithUnit,
		showTraceOnSpectrum2D,
		switchShowTraceOnSpectrum2D,
		handleWaveSliderChange,
		handleSpatialSliderChange,
		handleSliceContainerKeyDown,
		sliceManager,
	};
}
