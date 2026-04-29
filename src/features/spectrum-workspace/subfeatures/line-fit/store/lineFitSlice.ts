"use client";

import type { StateCreator } from "zustand";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasFitModelPatch,
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";
import type { FitPrior } from "@/hooks/query/fit/schemas";
import type { SpectrumWorkspaceStore } from "../../../store";
import {
	createDefaultGaussianFitModel,
	createDefaultLinearFitModel,
	getLineFitPriorParameters,
	getNextFitModelId,
	resolveAutoFitConfigurationName,
} from "../utils";

export type LineFitModelKind = Spectrum1DCanvasFitModel["kind"];

export interface SpectrumWorkspaceFitConfiguration {
	id: string;
	name: string;
	isNameCustomized: boolean;
	models: Spectrum1DCanvasFitModel[];
	priorsByModelId?: Record<number, Partial<Record<string, FitPrior>>>;
}

export interface LineFitSlice {
	fitConfigurationsBySourceId: Record<
		string,
		SpectrumWorkspaceFitConfiguration[]
	>;
	selectedFitConfigurationIdBySourceId: Record<string, string | null>;
	selectedFitJobConfigurationIdsBySourceId: Record<string, string[]>;
	createFitConfiguration: (
		sourceId: string,
		sliceRange: Spectrum1DCanvasWaveRange,
	) => string | null;
	deleteFitConfiguration: (sourceId: string, configurationId: string) => void;
	selectFitConfiguration: (
		sourceId: string,
		configurationId: string | null,
	) => void;
	toggleFitJobConfigurationSelection: (
		sourceId: string,
		configurationId: string,
	) => void;
	setFitJobConfigurationSelection: (
		sourceId: string,
		configurationIds: string[],
	) => void;
	clearFitJobConfigurationSelection: (sourceId: string) => void;
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
	setFitModelPrior: (
		sourceId: string,
		configurationId: string,
		modelId: number,
		paramName: string,
		prior: FitPrior | undefined,
	) => void;
	clearFitModelPrior: (
		sourceId: string,
		configurationId: string,
		modelId: number,
		paramName: string,
	) => void;
	clearActiveFitConfigurationPriors: (
		sourceId: string,
		configurationId: string,
	) => void;
	pruneFitConfigurationPriors: (
		sourceId: string,
		configurationId: string,
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
		priorsByModelId: {},
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

function prunePriorsByModelId(
	models: readonly Spectrum1DCanvasFitModel[],
	priorsByModelId: SpectrumWorkspaceFitConfiguration["priorsByModelId"],
): SpectrumWorkspaceFitConfiguration["priorsByModelId"] {
	if (!priorsByModelId) {
		return priorsByModelId;
	}

	const validModelParams = new Map(
		models.map((model) => [
			model.id,
			new Set(getLineFitPriorParameters(model)),
		]),
	);
	const nextPriorsByModelId: NonNullable<
		SpectrumWorkspaceFitConfiguration["priorsByModelId"]
	> = {};

	for (const [modelIdKey, priors] of Object.entries(priorsByModelId)) {
		const modelId = Number(modelIdKey);
		const validParams = validModelParams.get(modelId);
		if (!validParams || !priors) {
			continue;
		}

		const nextPriors: Partial<Record<string, FitPrior>> = {};
		for (const [paramName, prior] of Object.entries(priors)) {
			if (validParams.has(paramName) && prior) {
				nextPriors[paramName] = prior;
			}
		}

		if (Object.keys(nextPriors).length > 0) {
			nextPriorsByModelId[modelId] = nextPriors;
		}
	}

	return Object.keys(nextPriorsByModelId).length > 0 ? nextPriorsByModelId : {};
}

function setPriorOnConfiguration(
	configuration: SpectrumWorkspaceFitConfiguration,
	modelId: number,
	paramName: string,
	prior: FitPrior | undefined,
): SpectrumWorkspaceFitConfiguration {
	const model = configuration.models.find(
		(candidate) => candidate.id === modelId,
	);
	if (!model || !getLineFitPriorParameters(model).includes(paramName)) {
		return configuration;
	}

	const currentPriorsByModelId = configuration.priorsByModelId ?? {};
	const currentModelPriors = currentPriorsByModelId[modelId] ?? {};
	const nextModelPriors: Partial<Record<string, FitPrior>> = {
		...currentModelPriors,
	};

	if (prior) {
		nextModelPriors[paramName] = prior;
	} else {
		delete nextModelPriors[paramName];
	}

	const nextPriorsByModelId = { ...currentPriorsByModelId };
	if (Object.keys(nextModelPriors).length > 0) {
		nextPriorsByModelId[modelId] = nextModelPriors;
	} else {
		delete nextPriorsByModelId[modelId];
	}

	return {
		...configuration,
		priorsByModelId: nextPriorsByModelId,
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
	selectedFitJobConfigurationIdsBySourceId: {},
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
				selectedFitJobConfigurationIdsBySourceId: {
					...state.selectedFitJobConfigurationIdsBySourceId,
					[sourceId]: (
						state.selectedFitJobConfigurationIdsBySourceId[sourceId] ?? []
					).filter((selectedId) => selectedId !== configurationId),
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
	toggleFitJobConfigurationSelection: (sourceId, configurationId) =>
		set((state) => {
			const configurations = state.fitConfigurationsBySourceId[sourceId] ?? [];
			if (
				!configurations.some(
					(configuration) => configuration.id === configurationId,
				)
			) {
				return state;
			}

			const selectedIds =
				state.selectedFitJobConfigurationIdsBySourceId[sourceId] ?? [];
			const nextSelectedIds = selectedIds.includes(configurationId)
				? selectedIds.filter((selectedId) => selectedId !== configurationId)
				: [...selectedIds, configurationId];

			return {
				selectedFitJobConfigurationIdsBySourceId: {
					...state.selectedFitJobConfigurationIdsBySourceId,
					[sourceId]: nextSelectedIds,
				},
			};
		}),
	setFitJobConfigurationSelection: (sourceId, configurationIds) =>
		set((state) => {
			const validConfigurationIds = new Set(
				(state.fitConfigurationsBySourceId[sourceId] ?? []).map(
					(configuration) => configuration.id,
				),
			);

			return {
				selectedFitJobConfigurationIdsBySourceId: {
					...state.selectedFitJobConfigurationIdsBySourceId,
					[sourceId]: configurationIds.filter((configurationId) =>
						validConfigurationIds.has(configurationId),
					),
				},
			};
		}),
	clearFitJobConfigurationSelection: (sourceId) =>
		set((state) => ({
			selectedFitJobConfigurationIdsBySourceId: {
				...state.selectedFitJobConfigurationIdsBySourceId,
				[sourceId]: [],
			},
		})),
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
					priorsByModelId: Object.fromEntries(
						Object.entries(configuration.priorsByModelId ?? {}).filter(
							([priorModelId]) => Number(priorModelId) !== modelId,
						),
					),
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
	setFitModelPrior: (sourceId, configurationId, modelId, paramName, prior) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) =>
				setPriorOnConfiguration(configuration, modelId, paramName, prior),
			),
		),
	clearFitModelPrior: (sourceId, configurationId, modelId, paramName) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) =>
				setPriorOnConfiguration(configuration, modelId, paramName, undefined),
			),
		),
	clearActiveFitConfigurationPriors: (sourceId, configurationId) =>
		set((state) =>
			updateConfiguration(state, sourceId, configurationId, (configuration) => {
				const activeModelIds = new Set(
					configuration.models
						.filter((model) => model.active)
						.map((model) => model.id),
				);
				const nextPriorsByModelId = Object.fromEntries(
					Object.entries(configuration.priorsByModelId ?? {}).filter(
						([modelId]) => !activeModelIds.has(Number(modelId)),
					),
				);

				return {
					...configuration,
					priorsByModelId: nextPriorsByModelId,
				};
			}),
		),
	pruneFitConfigurationPriors: (sourceId, configurationId) =>
		set((state) =>
			updateConfiguration(
				state,
				sourceId,
				configurationId,
				(configuration) => ({
					...configuration,
					priorsByModelId: prunePriorsByModelId(
						configuration.models,
						configuration.priorsByModelId,
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
					priorsByModelId: prunePriorsByModelId(
						models,
						configuration.priorsByModelId,
					),
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
			const nextSelectedJobConfigurationsBySourceId: Record<string, string[]> =
				{};

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

			for (const [sourceId, configurationIds] of Object.entries(
				state.selectedFitJobConfigurationIdsBySourceId,
			)) {
				if (!validSourceIdSet.has(sourceId)) {
					changed = true;
					continue;
				}

				nextSelectedJobConfigurationsBySourceId[sourceId] = configurationIds;
			}

			return changed
				? {
						fitConfigurationsBySourceId: nextConfigurationsBySourceId,
						selectedFitConfigurationIdBySourceId: nextSelectedBySourceId,
						selectedFitJobConfigurationIdsBySourceId:
							nextSelectedJobConfigurationsBySourceId,
					}
				: state;
		}),
});
