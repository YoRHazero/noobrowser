import { useShallow } from "zustand/react/shallow";
import { useInspectorStore } from "@/stores/inspector";
import { useAnalyzerStore } from "@/stores/analyzer";
import { useSourcesStore } from "@/stores/sources";

import type { GlobalControlSettings } from "../types";

export function useGlobalControls() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const {
		traceSources,
		mainTraceSourceId,
		clearTraceSources,
		applyRoiToAllTraceSources,
	} = useSourcesStore(
		useShallow((state) => ({
			traceSources: state.traceSources,
			mainTraceSourceId: state.mainTraceSourceId,
			clearTraceSources: state.clearTraceSources,
			applyRoiToAllTraceSources: state.applyRoiToAllTraceSources,
		})),
	);
	const {
		roiState,
		roiCollapseWindow: collapseWindow,
	} = useInspectorStore(
		useShallow((state) => ({
			roiState: state.roiState,
			roiCollapseWindow: state.roiCollapseWindow,
		})),
	);

	const {
		apertureSize,
		setApertureSize,
		forwardWaveRange,
		setForwardWaveRange,
	} = useAnalyzerStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			setApertureSize: state.setApertureSize,
			forwardWaveRange: state.forwardWaveRange,
			setForwardWaveRange: state.setForwardWaveRange,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const settings: GlobalControlSettings = {
		apertureSize,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
	};
	const isWaveRangeValid = settings.waveMax > settings.waveMin;

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const setSettings: React.Dispatch<
		React.SetStateAction<GlobalControlSettings>
	> = (value) => {
		const nextSettings =
			typeof value === "function"
				? (
						value as (prevState: GlobalControlSettings) => GlobalControlSettings
					)(settings)
				: value;
		setApertureSize(nextSettings.apertureSize);
		setForwardWaveRange({
			min: nextSettings.waveMin,
			max: nextSettings.waveMax,
		});
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		settings,
		isWaveRangeValid,
		totalSources: traceSources.length,
		mainId: mainTraceSourceId,

		setSettings,
		clear: clearTraceSources,
		sync: () => {
			applyRoiToAllTraceSources({
				roiState,
				collapseWindow,
			});
		},
	};
}
