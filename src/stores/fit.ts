// stores/fit.ts

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_COLOR } from "@/components/ui/color-chooser";

import type {
	FitConfiguration,
	FitExtractionSettings,
	FitGaussianModel,
	FitLinearModel,
	FitModel,
	FitModelType,
	FitPrior,
	FitRange,
	WaveFrame,
} from "@/stores/stores-types";
import {
	normalizeModels,
	normalizeRange,
	updatePriorInModel,
} from "@/stores/stores-utils";

export interface FitState {
	waveFrame: WaveFrame;
	models: FitModel[];
	configurations: FitConfiguration[];
	tags: string[];
	selectedTags: string[];
	fitExtraction: FitExtractionSettings;
	setWaveFrame: (frame: WaveFrame) => void;
	setFitExtraction: (patch: Partial<FitExtractionSettings>) => void;
	setTags: (tags: string[]) => void;
	addTags: (tags: string[]) => void;
	setSelectedTags: (tags: string[]) => void;
	addSelectedTags: (tags: string[]) => void;
	removeSelectedTags: (tags: string[]) => void;

	ensureInitialModels: (range: FitRange) => void;
	duplicateNameIds: () => number[];

	updateModelPrior: (
		modelId: number,
		paramName: string,
		prior: FitPrior | undefined,
	) => void;
	updateConfigurationModelPrior: (
		configId: string,
		modelId: number,
		paramName: string,
		prior: FitPrior | undefined,
	) => void;

	addModel: (kind: FitModelType, range: FitRange) => void;
	addLinearModel: (range: FitRange) => void;
	addGaussianModel: (range: FitRange) => void;
	updateModel: (
		id: number,
		patch: Partial<FitLinearModel> | Partial<FitGaussianModel>,
	) => void;
	removeModel: (id: number) => void;
	renameModel: (id: number, name: string) => void;
	validateModel: () => void;
	toggleActive: (id: number, active: boolean) => void;
	filterModel: (predicate: (model: FitModel) => boolean) => FitModel[];
	filterGaussianModel: () => FitGaussianModel[];
	filterLinearModel: () => FitLinearModel[];
	filterActivatedModel: () => FitModel[];

	saveCurrentConfiguration: () => void;
	removeConfiguration: (id: string) => void;
	toggleConfigurationSelection: (id: string) => void;
	loadConfigurationToDraft: (id: string) => void;
	getSelectedConfiguration: () => FitConfiguration[];
	setConfigurationName: (id: string, name: string) => void;


}

/* -------------------------------- store ----------------------------------- */

export const useFitStore = create<FitState>()(
	persist(
		(set, get) => {
			const normalizeTags = (tags: string[]) => {
				const seen = new Set<string>();
				const normalized: string[] = [];
				for (const raw of tags) {
					const tag = raw.trim();
					if (!tag || seen.has(tag)) continue;
					seen.add(tag);
					normalized.push(tag);
				}
				return normalized;
			};

			return {
			waveFrame: "observe",
			models: [],
			configurations: [],
			tags: [],
			selectedTags: [],
			fitExtraction: { apertureSize: 5, offset: 0, extractMode: "GRISMR" },
			setWaveFrame: (frame) => set({ waveFrame: frame }),
			setFitExtraction: (patch) =>
				set((state) => ({
					fitExtraction: { ...state.fitExtraction, ...patch },
				})),
			setTags: (tags) => set({ tags: normalizeTags(tags) }),
			addTags: (tags) =>
				set((state) => ({
					tags: normalizeTags([...state.tags, ...tags]),
				})),
			setSelectedTags: (tags) => set({ selectedTags: normalizeTags(tags) }),
			addSelectedTags: (tags) =>
				set((state) => ({
					selectedTags: normalizeTags([...state.selectedTags, ...tags]),
				})),
			removeSelectedTags: (tags) =>
				set((state) => ({
					selectedTags: state.selectedTags.filter((tag) => !tags.includes(tag)),
				})),
			ensureInitialModels: (range) => {
				const state = get();
				if (state.models.length > 0) return;

				state.addLinearModel(range);
				state.addGaussianModel(range);
			},
			duplicateNameIds: () => {
				const models = get().models;
				const nameCount: Record<string, number> = {};
				models.forEach((model) => {
					nameCount[model.name] = (nameCount[model.name] || 0) + 1;
				});
				const duplicateIds: number[] = [];
				models.forEach((model) => {
					if (nameCount[model.name] > 1) {
						duplicateIds.push(model.id);
					}
				});
				return duplicateIds;
			},
			updateModelPrior: (modelId, paramName, prior) =>
				set((state) => ({
					models: updatePriorInModel(state.models, modelId, paramName, prior),
				})),
			updateConfigurationModelPrior: (configId, modelId, paramName, prior) =>
				set((state) => ({
					configurations: state.configurations.map((config) => {
						if (config.id !== configId) return config;
						return {
							...config,
							models: updatePriorInModel(
								config.models,
								modelId,
								paramName,
								prior,
							),
						};
					}),
				})),
			addLinearModel: (range) =>
				set((state) => {
					const r = normalizeRange(range);
					const center = 0.5 * (r.min + r.max);
					const model: FitLinearModel = {
						id: 0,
						kind: "linear",
						name: "Linear 1",
						active: true,
						subtracted: false,
						k: 0,
						b: 0,
						x0: center,
						range: r,
						color: DEFAULT_COLOR,
					};
					const merged = [...state.models, model];
					return { models: normalizeModels(merged) };
				}),

			addGaussianModel: (range) =>
				set((state) => {
					const r = normalizeRange(range);
					const center = 0.5 * (r.min + r.max);
					const model: FitGaussianModel = {
						id: 0,
						kind: "gaussian",
						name: "Gaussian 1",
						active: true,
						subtracted: false,
						amplitude: 0,
						mu: center,
						sigma: 0.0005, // 0.0005 µm = 5 Å
						range: r,
						color: DEFAULT_COLOR,
					};
					const merged = [...state.models, model];
					return { models: normalizeModels(merged) };
				}),

			addModel: (kind, range) => {
				if (kind === "linear") {
					get().addLinearModel(range);
				} else {
					get().addGaussianModel(range);
				}
			},

			updateModel: (id, patch) =>
				set((state) => ({
					models: state.models.map((model) => {
						if (model.id !== id) return model;
						if (model.kind === "linear") {
							const m: FitLinearModel = {
								...model,
								...(patch as Partial<FitLinearModel>),
								kind: "linear",
							};
							return m;
						} else {
							const m: FitGaussianModel = {
								...model,
								...(patch as Partial<FitGaussianModel>),
								kind: "gaussian",
							};
							return m;
						}
					}),
				})),

			removeModel: (id) =>
				set((state) => {
					const remaining = state.models.filter((m) => m.id !== id);
					return { models: normalizeModels(remaining) };
				}),

			renameModel: (id, name) =>
				set((state) => ({
					models: state.models.map((model) =>
						model.id === id ? { ...model, name } : model,
					),
				})),

			validateModel: () => {
				// Validate Gaussian sigma > 0
				set((state) => ({
					models: state.models.map((model) => {
						if (model.kind === "gaussian") {
							const sigma = Math.abs(model.sigma);
							return { ...model, sigma };
						}
						return model;
					}),
				}));
			},

			toggleActive: (id, active) =>
				set((state) => ({
					models: state.models.map((model) =>
						model.id === id ? { ...model, active } : model,
					),
				})),

			filterModel: (predicate) => {
				return get().models.filter(predicate);
			},

			filterGaussianModel: () => {
				return get().models.filter(
					(m) => m.kind === "gaussian",
				) as FitGaussianModel[];
			},

			filterLinearModel: () => {
				return get().models.filter(
					(m) => m.kind === "linear",
				) as FitLinearModel[];
			},

			filterActivatedModel: () => {
				return get().models.filter((m) => m.active);
			},
			saveCurrentConfiguration: () =>
				set((state) => {
					const modelsSnapshot = JSON.parse(JSON.stringify(state.models));
					const newConfig: FitConfiguration = {
						id: uuidv4(),
						name: `Config ${state.configurations.length + 1}`,
						models: modelsSnapshot,
						selected: true,
					};
					return { configurations: [...state.configurations, newConfig] };
				}),

			removeConfiguration: (id) =>
				set((state) => ({
					configurations: state.configurations.filter((c) => c.id !== id),
				})),

			toggleConfigurationSelection: (id) =>
				set((state) => ({
					configurations: state.configurations.map((c) =>
						c.id === id ? { ...c, selected: !c.selected } : c,
					),
				})),

			loadConfigurationToDraft: (id) =>
				set((state) => {
					const config = state.configurations.find((c) => c.id === id);
					if (!config) return {};
					const modelsCopy = JSON.parse(JSON.stringify(config.models));
					return { models: modelsCopy };
				}),

			getSelectedConfiguration: () => {
				return get().configurations.filter((c) => c.selected);
			},
			setConfigurationName: (id, name) =>
				set((state) => ({
					configurations: state.configurations.map((c) =>
						c.id === id ? { ...c, name: name } : c,
					),
				})),

		};
		},
		{
			name: "noobrowser-fit-store",
			partialize: (state) => ({
				configurations: state.configurations,
				tags: state.tags,
			}),
		},
	),
);
