"use client";

import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasFitModelPatch,
} from "@/canvas/spectrum1dCanvas";
import { useSpectrumWorkspaceSource } from "../../hooks";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../shared/types";
import { useSpectrumWorkspaceStore } from "../../store";
import type {
	LineFitModelKind,
	SpectrumWorkspaceFitConfiguration,
} from "./store";

export interface FitConfigurationCardModel {
	id: string;
	name: string;
	selected: boolean;
	modelSummary: string;
	onSelect: (configurationId: string) => void;
	onDelete: (configurationId: string) => void;
	onRename: (configurationId: string, name: string) => void;
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
	onModelKindChange: (kind: LineFitModelKind) => void;
	onAddModel: () => void;
	onSyncModels: () => void;
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
	toolbar: FitToolbarModel;
	modelList: FitModelListModel;
}

function getModelSummary(models: readonly Spectrum1DCanvasFitModel[]): string {
	const gaussianCount = models.filter(
		(model) => model.kind === "gaussian",
	).length;
	const linearCount = models.length - gaussianCount;
	const parts = [
		gaussianCount > 0 ? `${gaussianCount}G` : null,
		linearCount > 0 ? `${linearCount}L` : null,
	].filter(Boolean);

	return parts.length > 0 ? parts.join(" / ") : "0 models";
}

export function useSpectrumWorkspaceLineFit(): SpectrumWorkspaceLineFitViewModel {
	const source = useSpectrumWorkspaceSource();
	const [modelKind, setModelKind] = useState<LineFitModelKind>("gaussian");
	const {
		fitConfigurationsBySourceId,
		selectedFitConfigurationIdBySourceId,
		spectrum1dSliceRangeSourceId,
		spectrum1dSliceRange,
		redshift,
		wavelengthFrame,
		wavelengthUnit,
		createFitConfiguration,
		deleteFitConfiguration,
		selectFitConfiguration,
		renameFitConfiguration,
		addFitModel,
		updateFitModel,
		commitFitModelEdit,
		renameFitModel,
		setFitModelColor,
		deleteFitModel,
		toggleFitModelActive,
		toggleFitModelSubtractFromSlice,
		syncFitConfigurationToSliceRange,
	} = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			fitConfigurationsBySourceId: state.fitConfigurationsBySourceId,
			selectedFitConfigurationIdBySourceId:
				state.selectedFitConfigurationIdBySourceId,
			spectrum1dSliceRangeSourceId: state.spectrum1dSliceRangeSourceId,
			spectrum1dSliceRange: state.spectrum1dSliceRange,
			redshift: state.redshift,
			wavelengthFrame: state.wavelengthFrame,
			wavelengthUnit: state.wavelengthUnit,
			createFitConfiguration: state.createFitConfiguration,
			deleteFitConfiguration: state.deleteFitConfiguration,
			selectFitConfiguration: state.selectFitConfiguration,
			renameFitConfiguration: state.renameFitConfiguration,
			addFitModel: state.addFitModel,
			updateFitModel: state.updateFitModel,
			commitFitModelEdit: state.commitFitModelEdit,
			renameFitModel: state.renameFitModel,
			setFitModelColor: state.setFitModelColor,
			deleteFitModel: state.deleteFitModel,
			toggleFitModelActive: state.toggleFitModelActive,
			toggleFitModelSubtractFromSlice: state.toggleFitModelSubtractFromSlice,
			syncFitConfigurationToSliceRange: state.syncFitConfigurationToSliceRange,
		})),
	);
	const sourceId = source?.id ?? null;
	const configurations = useMemo(
		() => (sourceId ? (fitConfigurationsBySourceId[sourceId] ?? []) : []),
		[fitConfigurationsBySourceId, sourceId],
	);
	const selectedConfigurationId = sourceId
		? (selectedFitConfigurationIdBySourceId[sourceId] ?? null)
		: null;
	const selectedConfiguration = useMemo(
		() =>
			selectedConfigurationId === null
				? null
				: (configurations.find(
						(configuration) => configuration.id === selectedConfigurationId,
					) ?? null),
		[configurations, selectedConfigurationId],
	);
	const currentSliceRange =
		sourceId !== null && spectrum1dSliceRangeSourceId === sourceId
			? spectrum1dSliceRange
			: null;
	const canCreateConfiguration =
		sourceId !== null && currentSliceRange !== null;
	const canEditModels =
		sourceId !== null &&
		selectedConfiguration !== null &&
		currentSliceRange !== null;

	const handleCreateConfiguration = useCallback(() => {
		if (sourceId === null || currentSliceRange === null) {
			return;
		}

		createFitConfiguration(sourceId, currentSliceRange);
	}, [createFitConfiguration, currentSliceRange, sourceId]);
	const handleSelectConfiguration = useCallback(
		(configurationId: string) => {
			if (sourceId === null) {
				return;
			}

			selectFitConfiguration(sourceId, configurationId);
		},
		[selectFitConfiguration, sourceId],
	);
	const handleDeleteConfiguration = useCallback(
		(configurationId: string) => {
			if (sourceId === null) {
				return;
			}

			deleteFitConfiguration(sourceId, configurationId);
		},
		[deleteFitConfiguration, sourceId],
	);
	const handleRenameConfiguration = useCallback(
		(configurationId: string, name: string) => {
			if (sourceId === null) {
				return;
			}

			renameFitConfiguration(sourceId, configurationId, name);
		},
		[renameFitConfiguration, sourceId],
	);
	const handleAddModel = useCallback(() => {
		if (
			sourceId === null ||
			selectedConfiguration === null ||
			currentSliceRange === null
		) {
			return;
		}

		addFitModel(
			sourceId,
			selectedConfiguration.id,
			modelKind,
			currentSliceRange,
		);
	}, [
		addFitModel,
		currentSliceRange,
		modelKind,
		selectedConfiguration,
		sourceId,
	]);
	const handleSyncModels = useCallback(() => {
		if (
			sourceId === null ||
			selectedConfiguration === null ||
			currentSliceRange === null
		) {
			return;
		}

		syncFitConfigurationToSliceRange(
			sourceId,
			selectedConfiguration.id,
			currentSliceRange,
		);
	}, [
		currentSliceRange,
		selectedConfiguration,
		sourceId,
		syncFitConfigurationToSliceRange,
	]);
	const handleUpdateModel = useCallback(
		(modelId: number, patch: Spectrum1DCanvasFitModelPatch) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			updateFitModel(sourceId, selectedConfiguration.id, modelId, patch);
		},
		[selectedConfiguration, sourceId, updateFitModel],
	);
	const handleCommitModelEdit = useCallback(
		(modelId: number) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			commitFitModelEdit(sourceId, selectedConfiguration.id, modelId);
		},
		[commitFitModelEdit, selectedConfiguration, sourceId],
	);
	const handleRenameModel = useCallback(
		(modelId: number, label: string) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			renameFitModel(sourceId, selectedConfiguration.id, modelId, label);
		},
		[renameFitModel, selectedConfiguration, sourceId],
	);
	const handleSetModelColor = useCallback(
		(modelId: number, color: string) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			setFitModelColor(sourceId, selectedConfiguration.id, modelId, color);
		},
		[selectedConfiguration, setFitModelColor, sourceId],
	);
	const handleDeleteModel = useCallback(
		(modelId: number) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			deleteFitModel(sourceId, selectedConfiguration.id, modelId);
		},
		[deleteFitModel, selectedConfiguration, sourceId],
	);
	const handleToggleModelActive = useCallback(
		(modelId: number) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			toggleFitModelActive(sourceId, selectedConfiguration.id, modelId);
		},
		[selectedConfiguration, sourceId, toggleFitModelActive],
	);
	const handleToggleModelSubtractFromSlice = useCallback(
		(modelId: number) => {
			if (sourceId === null || selectedConfiguration === null) {
				return;
			}

			toggleFitModelSubtractFromSlice(
				sourceId,
				selectedConfiguration.id,
				modelId,
			);
		},
		[selectedConfiguration, sourceId, toggleFitModelSubtractFromSlice],
	);

	return {
		sourceReady: sourceId !== null,
		selectedConfiguration,
		configurationStrip: {
			configurations: configurations.map((configuration) => ({
				id: configuration.id,
				name: configuration.name,
				selected: configuration.id === selectedConfigurationId,
				modelSummary: getModelSummary(configuration.models),
				onSelect: handleSelectConfiguration,
				onDelete: handleDeleteConfiguration,
				onRename: handleRenameConfiguration,
			})),
			canCreateConfiguration,
			onCreateConfiguration: handleCreateConfiguration,
		},
		toolbar: {
			modelKind,
			canAddModel: canEditModels,
			canSyncModels: canEditModels,
			onModelKindChange: setModelKind,
			onAddModel: handleAddModel,
			onSyncModels: handleSyncModels,
		},
		modelList: {
			models: selectedConfiguration?.models ?? [],
			display: {
				redshift,
				wavelengthFrame,
				wavelengthUnit,
			},
			onUpdateModel: handleUpdateModel,
			onCommitModelEdit: handleCommitModelEdit,
			onRenameModel: handleRenameModel,
			onSetModelColor: handleSetModelColor,
			onDeleteModel: handleDeleteModel,
			onToggleModelActive: handleToggleModelActive,
			onToggleModelSubtractFromSlice: handleToggleModelSubtractFromSlice,
		},
	};
}
