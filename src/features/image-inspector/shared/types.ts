export type WorkspaceSection =
	| "baseLayer"
	| "referenceLayer"
	| "maskLayer"
	| "annotationLayer"
	| "settings";

export type ImageInspectorFetchStatus =
	| "idle"
	| "pending"
	| "success"
	| "error";

export interface WorkspaceSectionOption {
	value: WorkspaceSection;
	label: string;
	shortLabel: string;
	ariaLabel: string;
}

export type ReferenceLayerRgbChannel = "r" | "g" | "b";

export type ReferenceLayerMode = "rgb" | ReferenceLayerRgbChannel;

export type ReferenceLayerFilterRgb = Record<ReferenceLayerRgbChannel, string>;

export type BaseLayerColorMap =
	| "gray"
	| "viridis"
	| "magma"
	| "plasma"
	| "inferno";

export type BaseLayerNormRangeMode = "percentile" | "absolute";

export type BaseLayerStretch = "linear" | "sqrt" | "log" | "asinh";
