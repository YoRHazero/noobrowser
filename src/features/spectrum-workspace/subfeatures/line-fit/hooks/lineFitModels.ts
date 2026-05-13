import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasFitModelPatch,
} from "@/canvas/spectrum1dCanvas";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";
import type {
	LineFitModelKind,
	SpectrumWorkspaceFitConfiguration,
} from "../store";
import type { LineFitPriorDrawerModel } from "./lineFitPriorDrawerModels";

export interface FitConfigurationCardModel {
	id: string;
	name: string;
	selected: boolean;
	includedInJob: boolean;
	modelSummary: string;
	onSelect: (configurationId: string) => void;
	onDelete: (configurationId: string) => void;
	onRename: (configurationId: string, name: string) => void;
	onOpenPriors: (configurationId: string) => void;
	onToggleIncludedInJob: (configurationId: string) => void;
}

export interface FitConfigurationStripModel {
	configurations: FitConfigurationCardModel[];
	canCreateConfiguration: boolean;
	onCreateConfiguration: () => void;
}

export interface FitToolbarModel {
	modelKind: LineFitModelKind;
	canAddModel: boolean;
	canSyncModels: boolean;
	canFit: boolean;
	fitError: string | null;
	onModelKindChange: (kind: LineFitModelKind) => void;
	onAddModel: () => void;
	onSyncModels: () => void;
	onFit: () => void;
}

export interface FitJobActionBarModel {
	selectedConfigurationCount: number;
	activeModelCount: number;
	statusLabel: string;
	detailLabel: string;
	canSubmit: boolean;
	isSubmitting: boolean;
	tooltip: string;
	onSubmit: () => void;
	jobSettings: FitJobSettingsModel;
}

export type FitJobExtractMode = "GRISMR" | "GRISMC";

export interface FitJobSettingsModel {
	offsetValue: string;
	apertureSizeValue: string;
	extractMode: FitJobExtractMode;
	offsetInvalid: boolean;
	apertureSizeInvalid: boolean;
	onOffsetChange: (value: string) => void;
	onOffsetBlur: () => void;
	onApertureSizeChange: (value: string) => void;
	onApertureSizeBlur: () => void;
	onExtractModeChange: (mode: FitJobExtractMode) => void;
	onReset: () => void;
}

export interface FitModelListModel {
	models: Spectrum1DCanvasFitModel[];
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
	onUpdateModel: (
		modelId: number,
		patch: Spectrum1DCanvasFitModelPatch,
	) => void;
	onCommitModelEdit: (modelId: number) => void;
	onRenameModel: (modelId: number, label: string) => void;
	onSetModelColor: (modelId: number, color: string) => void;
	onDeleteModel: (modelId: number) => void;
	onToggleModelActive: (modelId: number) => void;
	onToggleModelSubtractFromSlice: (modelId: number) => void;
}

export interface SpectrumWorkspaceLineFitViewModel {
	sourceReady: boolean;
	selectedConfiguration: SpectrumWorkspaceFitConfiguration | null;
	configurationStrip: FitConfigurationStripModel;
	jobActionBar: FitJobActionBarModel;
	toolbar: FitToolbarModel;
	modelList: FitModelListModel;
	priorDrawer: LineFitPriorDrawerModel;
}
