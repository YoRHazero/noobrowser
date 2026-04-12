export type { TargetHubExtractionDraft } from "../../../../../shared/types";

export interface EditorHeaderModel {
	isDetail: boolean;
	canReturn: boolean;
	canSubmit: boolean;
	onEnterCreateMode: () => void;
	onReturnToDetailMode: () => void;
	onCreateSource: () => void;
}

export interface EditorIdentityModel {
	isDetail: boolean;
	labelValue: string;
	idValue: string;
	draftLabel: string;
	onLabelChange: (value: string) => void;
}

export interface EditorSkyPositionModel {
	isDetail: boolean;
	raValue: string;
	decValue: string;
	draftRa: string;
	draftDec: string;
	onRaChange: (value: string) => void;
	onDecChange: (value: string) => void;
}

export interface EditorFootprintOption {
	label: string;
	value: string;
	tooltip: string | null;
}

export interface EditorFootprintModel {
	value: string | null;
	options: EditorFootprintOption[];
	canSyncCurrentFootprint: boolean;
	onChange: (refBasename: string | null) => void;
	onSyncCurrentFootprint: () => void;
}

export interface EditorImagePositionModel {
	xValue: string;
	yValue: string;
	canResolveXY: boolean;
	isResolvingXY: boolean;
	onResolveXY: () => Promise<void> | void;
}

export interface EditorExtractionModel {
	isSettingsOpen: boolean;
	apertureSize: string;
	waveMinUm: string;
	waveMaxUm: string;
	canSave: boolean;
	saveDisabledReason: string | null;
	onOpenChange: (open: boolean) => void;
	onApertureSizeChange: (value: string) => void;
	onWaveMinUmChange: (value: string) => void;
	onWaveMaxUmChange: (value: string) => void;
	onSave: () => void;
	onReset: () => void;
}

export interface EditorSpectrumModel {
	canFetch: boolean;
	fetchDisabledReason: string | null;
	onFetch: () => void;
}

export interface EditorActionsModel {
	overviewVisible: boolean;
	inspectorVisible: boolean;
	onToggleOverview: () => void;
	onToggleInspector: () => void;
}

export interface EditorModel {
	header: EditorHeaderModel;
	identity: EditorIdentityModel;
	skyPosition: EditorSkyPositionModel;
	imagePosition: EditorImagePositionModel;
	footprint: EditorFootprintModel;
	extraction: EditorExtractionModel;
	spectrum: EditorSpectrumModel;
	actions: EditorActionsModel;
}

export interface TargetHubFootprintRecord {
	id: string;
	refBasename: string | null;
}
