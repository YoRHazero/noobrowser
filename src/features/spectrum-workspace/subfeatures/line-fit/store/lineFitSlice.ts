"use client";

import type { StateCreator } from "zustand";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasFitModelPatch,
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";
import type { SpectrumWorkspaceStore } from "../../../store";
import {
	createDefaultGaussianFitModel,
	createDefaultLinearFitModel,
	getNextFitModelId,
	resolveAutoFitConfigurationName,
} from "../utils";

export type LineFitModelKind = Spectrum1DCanvasFitModel["kind"];

export interface SpectrumWorkspaceFitConfiguration {
	id: string;
	name: string;
	isNameCustomized: boolean;
	models: Spectrum1DCanvasFitModel[];
}

export interface LineFitSlice {
	fitConfigurationsBySourceId: Record<
		string,
		SpectrumWorkspaceFitConfiguration[]
	>;
	selectedFitConfigurationIdBySourceId: Record<string, string | null>;
	createFitConfiguration: (
		sourceId: string,
		sliceRange: Spectrum1DCanvasWaveRange,
	) => string | null;
	deleteFitConfiguration: (sourceId: string, configurationId: string) => void;
	selectFitConfiguration: (
		sourceId: string,
		configurationId: string | null,
	) => void;
	renameFitConfiguration: (
		sourceId: string,
		configurationId: string,
		name: string,
	) => void;
	addFitModel: (
		sourceId: string,
		configurationId: string,
		kind: LineFitModelKind,
		sliceRange: Spectrum1DCanvasWaveRange,
	) => void;
	updateFitModel: (
		sourceId: string,
		configurationId: string,
		modelId: number,
		patch: Spectrum1DCanvasFitModelPatch,
	) => void;
	commitFitModelEdit: (
		sourceId: string,
		configurationId: string,
		modelId: number,
	) => void;
	renameFitModel: (
		sourceId: string,
		configurationId: string,
		modelId: number,
		label: string,
	) => void;
	setFitModelColor: (
		sourceId: string,
		configurationId: string,
		modelId: number,
		color: string,
	) => void;
	deleteFitModel: (
		sourceId: string,
		configurationId: string,
		modelId: number,
	) => void;
	toggleFitModelActive: (
		sourceId: string,
		configurationId: string,
		modelId: number,
	) => void;
	toggleFitModelSubtractFromSlice: (
		sourceId: string,
		configurationId: string,
		modelId: number,
	) => void;
	replaceFitConfigurationModels: (
		sourceId: string,
		configurationId: string,
		models: Spectrum1DCanvasFitModel[],
	) => void;
	syncFitConfigurationToSliceRange: (
		sourceId: string,
		configurationId: string,
		sliceRange: Spectrum1DCanvasWaveRange,
	) => void;
	pruneFitStateForMissingSources: (validSourceIds: readonly string[]) => void;
}

function createFitConfigurationId(): string {
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID();
	}

	return `fit-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2)}`;
}

function normalizeLabel(label: string): string {
	return label.trim().replace(/\s+/g, " ");
}

function normalizeRange(
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange {
	return {
		minUm: Math.min(range.minUm, range.maxUm),
		maxUm: Math.max(range.minUm, range.maxUm),
	};
}

function countGaussianModels(
	models: readonly Spectrum1DCanvasFitModel[],
): number {
	return models.reduce(
		(count, model) => count + (model.kind === "gaussian" ? 1 : 0),
		0,
	);
}

function withAutoName(
	configuration: SpectrumWorkspaceFitConfiguration,
): SpectrumWorkspaceFitConfiguration {
	if (configuration.isNameCustomized) {
		return configuration;
	}

	return {
		...configuration,
		name: resolveAutoFitConfigurationName(
			countGaussianModels(configuration.models),
		),
	};
}

function getNextModelLabel(
	models: readonly Spectrum1DCanvasFitModel[],
	kind: LineFitModelKind,
): string {
	const prefix = kind === "gaussian" ? "Gaussian" : "Linear";
	const numberPattern = new RegExp(`^${prefix} (\\d+)$`);
	const maxSuffix = models.reduce((maxValue, model) => {
		if (model.kind !== kind) {
			return maxValue;
		}

		const match = numberPattern.exec(model.label);
		if (!match) {
			return maxValue;
		}

		const suffix = Number.parseInt(match[1], 10);
		return Number.isFinite(suffix) ? Math.max(maxValue, suffix) : maxValue;
	}, 0);

	return `${prefix} ${maxSuffix + 1}`;
}

function createDefaultConfiguration(
	sliceRange: Spectrum1DCanvasWaveRange,
): SpectrumWorkspaceFitConfiguration {
	const gaussian = createDefaultGaussianFitModel({
		id: 1,
		label: "Gaussian 1",
		range: sliceRange,
	});
	const linear = createDefaultLinearFitModel({
		id: 2,
		label: "Linear 1",
		range: sliceRange,
	});

	return {
		id: createFitConfigurationId(),
		name: resolveAutoFitConfigurationName(1),
		isNameCustomized: false,
		models: [gaussian, linear],
	};
}

function updateConfiguration(
	state: SpectrumWorkspaceStore,
	sourceId: string,
	configurationId: string,
	updater: (
		configuration: SpectrumWorkspaceFitConfiguration,
	) => SpectrumWorkspaceFitConfiguration,
): Pick<LineFitSlice, "fitConfigurationsBySourceId"> | SpectrumWorkspaceStore {
	const configurations = state.fitConfigurationsBySourceId[sourceId] ?? [];
	const configurationIndex = configurations.findIndex(
		(configuration) => configuration.id === configurationId,
	);

	if (configurationIndex === -1) {
		return state;
	}

	return {
		fitConfigurationsBySourceId: {
			...state.fitConfigurationsBySourceId,
			[sourceId]: configurations.map((configuration, index) =>
				index === configurationIndex ? updater(configuration) : configuration,
			),
		},
	};
}

function applyFitModelPatch(
	model: Spectrum1DCanvasFitModel,
	patch: Spectrum1DCanvasFitModelPatch,
): Spectrum1DCanvasFitModel {
	if (patch.kind === "gaussian") {
		if (model.kind !== "gaussian") {
			return model;
		}

		const nextModel: Spectrum1DCanvasGaussianFitModel = {
			...model,
			...patch.patch,
			kind: "gaussian",
		};

		return patch.patch.range
			? { ...nextModel, range: normalizeRange(patch.patch.range) }
			: nextModel;
	}

	if (model.kind !== "linear") {
		return model;
	}

	const nextModel: Spectrum1DCanvasLinearFitModel = {
		...model,
		...patch.patch,
		kind: "linear",
	};

	return patch.patch.range
		? { ...nextModel, range: normalizeRange(patch.patch.range) }
		: nextModel;
}

function commitFitModel(
	model: Spectrum1DCanvasFitModel,
): Spectrum1DCanvasFitModel {
	if (model.kind === "gaussian") {
		return {
			...model,
			range: normalizeRange(model.range),
			sigmaUm: Number.isFinite(model.sigmaUm) ? Math.abs(model.sigmaUm) : 0,
		};
	}

	return {
		...model,
		range: normalizeRange(model.range),
	};
}

export const createLineFitSlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	LineFitSlice
> = (set) => ({
	fitConfigurationsBySourceId: {},
	selectedFitConfigurationIdBySourceId: {},
	createFitConfiguration: (sourceId, sliceRange) => {
		if (!sourceId) {
			return null;
		}

		const configuration = createDefaultConfiguration(sliceRange);
		set((state) => ({
			fitConfigurationsBySourceId: {
				...state.fitConfigurationsBySourceId,
				[sourceId]: [
					...(state.fitConfigurationsBySourceId[sourceId] ?? []),
					configuration,
				],
			},
			selectedFitConfigurationIdBySourceId: {
				...state.selectedFitConfigurationIdBySourceId,
				[sourceId]: configuration.id,
			},
		}));

		return configuration.id;
	},
	deleteFitConfiguration: (sourceId, configurationId) =>
		set((state) => {
			const configurations = state.fitConfigurationsBySourceId[sourceId] ?? [];
			if (
				!configurations.some(
					(configuration) => configuration.id === configurationId,
				)
			) {
				return state;
			}

			return {
				fitConfigurationsBySourceId: {
					...state.fitConfigurationsBySourceId,
					[sourceId]: configurations.filter(
						(configuration) => configuration.id !== configurationId,
					),
				},
				selectedFitConfigurationIdBySourceId: {
					...state.selectedFitConfigurationIdBySourceId,
					[sourceId]:
						state.selectedFitConfigurationIdBySourceId[sourceId] ===
						configurationId
							? null
							: (state.selectedFitConfigurationIdBySourceId[sourceId] ?? null),
				},
			};
		}),
	selectFitConfiguration: (sourceId, configurationId) =>
		set((state) => {
			const configurations = state.fitConfigurationsBySourceId[sourceId] ?? [];
			const nextConfigurationId =
				configurationId !== null &&
				configurations.some(
					(configuration) => configuration.id === configurationId,
				)
					? configurationId
					: null;

			return {
				selectedFitConfigurationIdBySourceId: {
					...state.selectedFitConfigurationIdBySourceId,
					[sourceId]: nextConfigurationId,
				},
			};
		}),
	renameFitConfiguration: (sourceId, configurationId, name) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) => {
				const normalizedName = normalizeLabel(name);
				const nextConfiguration = {
					...configuration,
					isNameCustomized: normalizedName.length > 0,
					name: normalizedName || configuration.name,
				};

				return normalizedName
					? nextConfiguration
					: withAutoName(nextConfiguration);
			}),
		),
	addFitModel: (sourceId, configurationId, kind, sliceRange) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) => {
				const id = getNextFitModelId(configuration.models);
				const label = getNextModelLabel(configuration.models, kind);
				const model =
					kind === "gaussian"
						? createDefaultGaussianFitModel({ id, label, range: sliceRange })
						: createDefaultLinearFitModel({ id, label, range: sliceRange });

				return withAutoName({
					...configuration,
					models: [...configuration.models, model],
				});
			}),
		),
	updateFitModel: (sourceId, configurationId, modelId, patch) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					models: configuration.models.map((model) =>
						model.id === modelId ? applyFitModelPatch(model, patch) : model,
					),
				}),
			),
		),
	commitFitModelEdit: (sourceId, configurationId, modelId) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					models: configuration.models.map((model) =>
						model.id === modelId ? commitFitModel(model) : model,
					),
				}),
			),
		),
	renameFitModel: (sourceId, configurationId, modelId, label) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					models: configuration.models.map((model) =>
						model.id === modelId
							? {
									...model,
									label: normalizeLabel(label) || `Model ${model.id}`,
								}
							: model,
					),
				}),
			),
		),
	setFitModelColor: (sourceId, configurationId, modelId, color) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					models: configuration.models.map((model) =>
						model.id === modelId ? { ...model, color } : model,
					),
				}),
			),
		),
	deleteFitModel: (sourceId, configurationId, modelId) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) =>
				withAutoName({
					...configuration,
					models: configuration.models.filter((model) => model.id !== modelId),
				}),
			),
		),
	toggleFitModelActive: (sourceId, configurationId, modelId) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					models: configuration.models.map((model) =>
						model.id === modelId ? { ...model, active: !model.active } : model,
					),
				}),
			),
		),
	toggleFitModelSubtractFromSlice: (sourceId, configurationId, modelId) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					models: configuration.models.map((model) =>
						model.id === modelId
							? { ...model, subtractFromSlice: !model.subtractFromSlice }
							: model,
					),
				}),
			),
		),
	replaceFitConfigurationModels: (sourceId, configurationId, models) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) =>
				withAutoName({
					...configuration,
					models,
				}),
			),
		),
	syncFitConfigurationToSliceRange: (sourceId, configurationId, sliceRange) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) => {
				const normalizedRange = normalizeRange(sliceRange);
				const centerUm = 0.5 * (normalizedRange.minUm + normalizedRange.maxUm);

				return {
					...configuration,
					models: configuration.models.map((model) =>
						model.kind === "gaussian"
							? { ...model, range: normalizedRange, muUm: centerUm }
							: { ...model, range: normalizedRange, x0Um: centerUm },
					),
				};
			}),
		),
	pruneFitStateForMissingSources: (validSourceIds) =>
		set((state) => {
			const validSourceIdSet = new Set(validSourceIds);
			let changed = false;
			const nextConfigurationsBySourceId: Record<
				string,
				SpectrumWorkspaceFitConfiguration[]
			> = {};
			const nextSelectedBySourceId: Record<string, string | null> = {};

			for (const [sourceId, configurations] of Object.entries(
				state.fitConfigurationsBySourceId,
			)) {
				if (!validSourceIdSet.has(sourceId)) {
					changed = true;
					continue;
				}

				nextConfigurationsBySourceId[sourceId] = configurations;
			}

			for (const [sourceId, configurationId] of Object.entries(
				state.selectedFitConfigurationIdBySourceId,
			)) {
				if (!validSourceIdSet.has(sourceId)) {
					changed = true;
					continue;
				}

				nextSelectedBySourceId[sourceId] = configurationId;
			}

			return changed
				? {
						fitConfigurationsBySourceId: nextConfigurationsBySourceId,
						selectedFitConfigurationIdBySourceId: nextSelectedBySourceId,
					}
				: state;
		}),
});
