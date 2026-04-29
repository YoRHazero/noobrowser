import type { PriorType } from "@/hooks/query/fit/schemas";

export type LineFitPriorDrawerPriorType = PriorType | "Default";

export interface LineFitPriorDrawerModelOptionModel {
	modelId: number;
	name: string;
	hasPrior: boolean;
	selected: boolean;
	onSelect: () => void;
}

export interface LineFitPriorDrawerParameterModel {
	modelId: number;
	paramName: string;
	label: string;
	currentValue: string;
	priorType: LineFitPriorDrawerPriorType;
	selected: boolean;
	onSelect: () => void;
}

export interface LineFitPriorDrawerReferenceOptionModel {
	value: string;
	label: string;
	modelId: number;
	modelName: string;
	paramName: string;
	paramLabel: string;
}

export interface LineFitPriorDrawerEditorModel {
	modelName: string;
	paramName: string;
	paramLabel: string;
	currentValue: string;
	unitLabel: string | null;
	type: LineFitPriorDrawerPriorType;
	draft: Record<string, string>;
	referenceOptions: LineFitPriorDrawerReferenceOptionModel[];
	canUseVelocity: boolean;
	useVelocity: boolean;
	validationError: string | null;
	onTypeChange: (type: LineFitPriorDrawerPriorType) => void;
	onDraftChange: (field: string, value: string) => void;
	onUseVelocityChange: (useVelocity: boolean) => void;
}

export interface LineFitPriorDrawerAutoFwhmPriorsModel {
	canApply: boolean;
	tooltip: string;
	onApply: () => void;
}

export interface LineFitPriorDrawerModel {
	isOpen: boolean;
	configurationName: string;
	models: LineFitPriorDrawerModelOptionModel[];
	parameters: LineFitPriorDrawerParameterModel[];
	editor: LineFitPriorDrawerEditorModel | null;
	autoFwhmPriors: LineFitPriorDrawerAutoFwhmPriorsModel;
	canClearActivePriors: boolean;
	open: (configurationId: string) => void;
	close: () => void;
	onOpenChange: (open: boolean) => void;
	onClearActivePriors: () => void;
}
