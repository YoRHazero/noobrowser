"use client";

import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import GrismTraceSourceDrawerView from "./GrismTraceSourceDrawer.view";
import type { GlobalSettings, SetSettings } from "./types";

export default function GrismTraceSourceDrawerContainer() {
	const {
		traceMode,
		traceSources,
		mainTraceSourceId,
		setMainTraceSource,
		removeTraceSource,
		clearTraceSources,
		updateTraceSource,
		applyRoiToAllTraceSources,
	} = useSourcesStore(
		useShallow((state) => ({
			traceMode: state.traceMode,
			traceSources: state.traceSources,
			mainTraceSourceId: state.mainTraceSourceId,
			setMainTraceSource: state.setMainTraceSource,
			removeTraceSource: state.removeTraceSource,
			clearTraceSources: state.clearTraceSources,
			updateTraceSource: state.updateTraceSource,
			applyRoiToAllTraceSources: state.applyRoiToAllTraceSources,
		})),
	);

	const {
		roiState,
		collapseWindow,
		apertureSize,
		setApertureSize,
		forwardWaveRange,
		setForwardWaveRange,
	} = useGrismStore(
		useShallow((state) => ({
			roiState: state.roiState,
			collapseWindow: state.roiCollapseWindow,
			apertureSize: state.apertureSize,
			setApertureSize: state.setApertureSize,
			forwardWaveRange: state.forwardWaveRange,
			setForwardWaveRange: state.setForwardWaveRange,
		})),
	);

	const settings: GlobalSettings = {
		apertureSize,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
	};

	const setSettings: SetSettings = (value) => {
		const nextSettings =
			typeof value === "function"
				? (value as (prevState: GlobalSettings) => GlobalSettings)(settings)
				: value;

		setApertureSize(nextSettings.apertureSize);
		setForwardWaveRange({
			min: nextSettings.waveMin,
			max: nextSettings.waveMax,
		});
	};

	const isValidSettings = settings.waveMin < settings.waveMax;

	const onApplyRoi = () =>
		applyRoiToAllTraceSources({
			roiState,
			collapseWindow,
		});

	return (
		<GrismTraceSourceDrawerView
			traceMode={traceMode}
			traceSources={traceSources}
			mainTraceSourceId={mainTraceSourceId}
			settings={settings}
			setSettings={setSettings}
			isValidSettings={isValidSettings}
			onSetMain={setMainTraceSource}
			onRemove={removeTraceSource}
			onClearAll={clearTraceSources}
			onApplyRoi={onApplyRoi}
			onUpdateSource={updateTraceSource}
		/>
	);
}
