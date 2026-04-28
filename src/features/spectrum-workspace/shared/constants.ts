import type {
	SpectrumWorkspaceDisplaySampleSource,
	SpectrumWorkspaceDisplayState,
	SpectrumWorkspaceHudTab,
	SpectrumWorkspaceWavelengthFrame,
	SpectrumWorkspaceWavelengthUnit,
} from "./types";

export const SPECTRUM_WORKSPACE_STORAGE_KEY =
	"noobrowser-spectrum-workspace-store";
export const SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MIN = 5;
export const SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MAX = 95;
export const SPECTRUM_WORKSPACE_DEFAULT_SAMPLE_SOURCE: SpectrumWorkspaceDisplaySampleSource =
	"full";
export const SPECTRUM_WORKSPACE_DEFAULT_HUD_TAB: SpectrumWorkspaceHudTab =
	"display";
export const SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT = 0;
export const SPECTRUM_WORKSPACE_DEFAULT_REDSHIFT_STEP = 0.001;
export const SPECTRUM_WORKSPACE_MIN_REDSHIFT = -0.99;
export const SPECTRUM_WORKSPACE_ANGSTROM_PER_MICRON = 1e4;
export const SPECTRUM_WORKSPACE_DEFAULT_WAVELENGTH_FRAME: SpectrumWorkspaceWavelengthFrame =
	"observed";
export const SPECTRUM_WORKSPACE_DEFAULT_WAVELENGTH_UNIT: SpectrumWorkspaceWavelengthUnit =
	"um";
export const SPECTRUM_WORKSPACE_WAVE_BOUND_FRACTION_DIGITS = 3;
export const SPECTRUM_WORKSPACE_LOG_FLOOR = 1e-6;
export const SPECTRUM_WORKSPACE_ASINH_SOFTNESS = 1;

export const SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE: SpectrumWorkspaceDisplayState =
	{
		colorMap: "gray",
		normKind: "linear",
		rangeMode: "percentile",
		pmin: SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MIN,
		pmax: SPECTRUM_WORKSPACE_DEFAULT_PERCENTILE_MAX,
		sampleSource: SPECTRUM_WORKSPACE_DEFAULT_SAMPLE_SOURCE,
		vmin: 0,
		vmax: 1,
	};
