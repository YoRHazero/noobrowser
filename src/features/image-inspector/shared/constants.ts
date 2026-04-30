import type { WorkspaceSection, WorkspaceSectionOption } from "./types";

export const IMAGE_INSPECTOR_DEFAULT_WORKSPACE_SECTION: WorkspaceSection =
	"baseLayer";

export const IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS = [
	{
		value: "baseLayer",
		label: "Base Layer",
		shortLabel: "Base",
		ariaLabel: "Open base layer workspace",
	},
	{
		value: "referenceLayer",
		label: "Reference Layer",
		shortLabel: "Ref",
		ariaLabel: "Open reference layer workspace",
	},
	{
		value: "maskLayer",
		label: "Mask Layer",
		shortLabel: "Mask",
		ariaLabel: "Open mask layer workspace",
	},
	{
		value: "annotationLayer",
		label: "Annotations",
		shortLabel: "Anno",
		ariaLabel: "Open annotation workspace",
	},
	{
		value: "settings",
		label: "Settings",
		shortLabel: "Set",
		ariaLabel: "Open image inspector settings",
	},
] as const satisfies readonly WorkspaceSectionOption[];

export const IMAGE_INSPECTOR_REFERENCE_CHANNEL_OPTIONS = [
	{ value: "r", label: "R", color: "red.300" },
	{ value: "g", label: "G", color: "green.300" },
	{ value: "b", label: "B", color: "blue.300" },
] as const;

export const IMAGE_INSPECTOR_REFERENCE_MODE_OPTIONS = [
	{ value: "rgb", label: "RGB" },
	{ value: "r", label: "R" },
	{ value: "g", label: "G" },
	{ value: "b", label: "B" },
] as const;

export const IMAGE_INSPECTOR_COUNTERPART_NORM_PARAMS = {
	pmin: 1,
	pmax: 99,
} as const;

export const IMAGE_INSPECTOR_ROI_SIZE = 256;

export const IMAGE_INSPECTOR_DEFAULT_ROI_POSITION = {
	x: 58,
	y: 36,
} as const;

export const IMAGE_INSPECTOR_BASE_LAYER_COLOR_MAP_OPTIONS = [
	{ value: "gray", label: "Gray" },
	{ value: "viridis", label: "Viridis" },
	{ value: "magma", label: "Magma" },
	{ value: "plasma", label: "Plasma" },
	{ value: "inferno", label: "Inferno" },
] as const;

export const IMAGE_INSPECTOR_BASE_LAYER_RANGE_MODE_OPTIONS = [
	{ value: "percentile", label: "Percentile" },
	{ value: "absolute", label: "Absolute" },
] as const;

export const IMAGE_INSPECTOR_BASE_LAYER_STRETCH_OPTIONS = [
	{ value: "linear", label: "Linear" },
	{ value: "sqrt", label: "Sqrt" },
	{ value: "log", label: "Log" },
	{ value: "asinh", label: "Asinh" },
] as const;
