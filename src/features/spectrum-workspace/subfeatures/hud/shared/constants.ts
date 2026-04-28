import type { Spectrum2DCanvasColorMap } from "@/canvas/spectrum2dCanvas";
import type {
	SpectrumWorkspaceDisplayNormKind,
	SpectrumWorkspaceDisplayRangeMode,
	SpectrumWorkspaceDisplaySampleSource,
	SpectrumWorkspaceHudTab,
} from "../../../shared/types";

export const SPECTRUM_WORKSPACE_HUD_COLOR_MAP_OPTIONS: readonly {
	value: Spectrum2DCanvasColorMap;
	label: string;
}[] = [
	{ value: "gray", label: "Gray" },
	{ value: "viridis", label: "Viridis" },
	{ value: "magma", label: "Magma" },
	{ value: "plasma", label: "Plasma" },
	{ value: "inferno", label: "Inferno" },
];

export const SPECTRUM_WORKSPACE_HUD_NORM_KIND_OPTIONS: readonly {
	value: SpectrumWorkspaceDisplayNormKind;
	label: string;
}[] = [
	{ value: "linear", label: "Linear" },
	{ value: "log", label: "Log" },
	{ value: "asinh", label: "Asinh" },
];

export const SPECTRUM_WORKSPACE_HUD_RANGE_MODE_OPTIONS: readonly {
	value: SpectrumWorkspaceDisplayRangeMode;
	label: string;
}[] = [
	{ value: "percentile", label: "Percentile" },
	{ value: "absolute", label: "Absolute" },
];

export const SPECTRUM_WORKSPACE_HUD_SAMPLE_SOURCE_OPTIONS: readonly {
	value: SpectrumWorkspaceDisplaySampleSource;
	label: string;
}[] = [
	{ value: "window", label: "Window" },
	{ value: "full", label: "Full" },
];

export const SPECTRUM_WORKSPACE_HUD_TAB_OPTIONS: readonly {
	value: SpectrumWorkspaceHudTab;
	label: string;
}[] = [
	{ value: "display", label: "Display" },
	{ value: "extraction", label: "Extraction" },
];
