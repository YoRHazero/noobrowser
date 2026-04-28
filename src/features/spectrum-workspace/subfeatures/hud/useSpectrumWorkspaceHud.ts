import { useShallow } from "zustand/react/shallow";
import {
	useSpectrumWorkspaceControls,
	useSpectrumWorkspaceSource,
	useWorkspaceSpectrumData,
} from "../../hooks";
import type {
	SpectrumWorkspaceDisplayNormKind,
	SpectrumWorkspaceDisplayRangeMode,
	SpectrumWorkspaceDisplaySampleSource,
	SpectrumWorkspaceDisplayState,
} from "../../shared/types";
import { useSpectrumWorkspaceStore } from "../../store";
import {
	type SpectrumWorkspaceHudDraftFieldModel,
	useSpectrumWorkspaceHudExtractionDrafts,
} from "./hooks/useSpectrumWorkspaceHudExtractionDrafts";

const EMPTY_COLLAPSE_WINDOW = {
	waveMinUm: 0,
	waveMaxUm: 0,
	spatialMin: 0,
	spatialMax: 0,
	outlineVisible: false,
};

const EMPTY_BOUNDS = {
	waveMinUm: 0,
	waveMaxUm: 0,
	spatialMin: 0,
	spatialMax: 0,
};

const NOOP_COMMIT_COLLAPSE_WINDOW_EDIT = () => {};

export type SpectrumWorkspaceHudViewModel =
	| { state: "hidden" }
	| {
			state: "ready";
			open: boolean;
			setOpen: (value: boolean) => void;
			activeTab: "display" | "extraction";
			setActiveTab: (value: "display" | "extraction") => void;
			triggerTransitionDelay: string;
			displayTab: {
				colorMap: SpectrumWorkspaceDisplayState["colorMap"];
				normKind: SpectrumWorkspaceDisplayNormKind;
				rangeMode: SpectrumWorkspaceDisplayRangeMode;
				pmin: number;
				pmax: number;
				sampleSource: SpectrumWorkspaceDisplaySampleSource;
				vmin: number;
				vmax: number;
				onColorMapChange: (
					value: SpectrumWorkspaceDisplayState["colorMap"],
				) => void;
				onNormKindChange: (value: SpectrumWorkspaceDisplayNormKind) => void;
				onRangeModeChange: (value: SpectrumWorkspaceDisplayRangeMode) => void;
				onSampleSourceChange: (
					value: SpectrumWorkspaceDisplaySampleSource,
				) => void;
				onPminChange: (value: number) => void;
				onPmaxChange: (value: number) => void;
				onVminChange: (value: number) => void;
				onVmaxChange: (value: number) => void;
			};
			extractionTab: {
				waveMinField: SpectrumWorkspaceHudDraftFieldModel;
				waveMaxField: SpectrumWorkspaceHudDraftFieldModel;
				spatialMinField: SpectrumWorkspaceHudDraftFieldModel;
				spatialMaxField: SpectrumWorkspaceHudDraftFieldModel;
				showWindow: boolean;
				showCenterLine: boolean;
				onShowWindowChange: (value: boolean) => void;
				onShowCenterLineChange: (value: boolean) => void;
			};
	  };

export function useSpectrumWorkspaceHud(): SpectrumWorkspaceHudViewModel {
	const source = useSpectrumWorkspaceSource();
	const workspaceData = useWorkspaceSpectrumData({ source });
	const controls = useSpectrumWorkspaceControls({
		source,
		extractedSpectrum:
			workspaceData.state === "ready" ? workspaceData.extractedSpectrum : null,
	});
	const { open, activeTab, setOpen, setActiveTab } = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			open: state.hudOpen,
			activeTab: state.hudTab,
			setOpen: state.setHudOpen,
			setActiveTab: state.setHudTab,
		})),
	);
	const extractionDrafts = useSpectrumWorkspaceHudExtractionDrafts({
		collapseWindow: controls?.collapseWindow ?? EMPTY_COLLAPSE_WINDOW,
		bounds: controls?.bounds ?? EMPTY_BOUNDS,
		commitCollapseWindowEdit:
			controls?.commitCollapseWindowEdit ?? NOOP_COMMIT_COLLAPSE_WINDOW_EDIT,
	});

	if (!source || workspaceData.state !== "ready" || controls === null) {
		return {
			state: "hidden",
		};
	}

	return {
		state: "ready",
		open,
		setOpen,
		activeTab,
		setActiveTab,
		triggerTransitionDelay: open ? "0ms" : "120ms",
		displayTab: {
			colorMap: controls.displayState.colorMap,
			normKind: controls.displayState.normKind,
			rangeMode: controls.displayState.rangeMode,
			pmin: controls.displayState.pmin,
			pmax: controls.displayState.pmax,
			sampleSource: controls.displayState.sampleSource,
			vmin: controls.displayState.vmin,
			vmax: controls.displayState.vmax,
			onColorMapChange: controls.setColorMap,
			onNormKindChange: controls.setNormKind,
			onRangeModeChange: controls.setRangeMode,
			onSampleSourceChange: controls.setSampleSource,
			onPminChange: (pmin: number) =>
				controls.setPercentileRange({
					pmin,
					pmax: controls.displayState.pmax,
				}),
			onPmaxChange: (pmax: number) =>
				controls.setPercentileRange({
					pmin: controls.displayState.pmin,
					pmax,
				}),
			onVminChange: (vmin: number) =>
				controls.setAbsoluteRange({
					vmin,
					vmax: controls.displayState.vmax,
				}),
			onVmaxChange: (vmax: number) =>
				controls.setAbsoluteRange({
					vmin: controls.displayState.vmin,
					vmax,
				}),
		},
		extractionTab: {
			...extractionDrafts,
			showWindow: controls.collapseWindow.outlineVisible,
			showCenterLine: controls.showSpatialCenterLine,
			onShowWindowChange: controls.setOutlineVisible,
			onShowCenterLineChange: controls.setShowSpatialCenterLine,
		},
	};
}
