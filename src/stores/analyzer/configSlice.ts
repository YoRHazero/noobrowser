import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import type { AnalyzerState } from "./index";
import type { FitConfiguration, FitPrior } from "./types";
import { updatePriorInModel } from "./utils";

export interface ConfigSlice {
	configurations: FitConfiguration[];
	tags: string[];
	selectedTags: string[];

	setTags: (tags: string[]) => void;
	addTags: (tags: string[]) => void;
	setSelectedTags: (tags: string[]) => void;
	addSelectedTags: (tags: string[]) => void;
	removeSelectedTags: (tags: string[]) => void;
	updateConfigurationModelPrior: (
		configId: string,
		modelId: number,
		paramName: string,
		prior: FitPrior | undefined
	) => void;
	saveCurrentConfiguration: () => void;
	removeConfiguration: (id: string) => void;
	toggleConfigurationSelection: (id: string) => void;
	loadConfigurationToDraft: (id: string) => void;
	getSelectedConfiguration: () => FitConfiguration[];
	setConfigurationName: (id: string, name: string) => void;
}

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

export const createConfigSlice: StateCreator<
	AnalyzerState,
	[],
	[],
	ConfigSlice
> = (set, get) => ({
	configurations: [],
	tags: [],
	selectedTags: [],

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
			selectedTags: state.selectedTags.filter(
				(tag) => !tags.includes(tag)
			),
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
						prior
					),
				};
			}),
		})),

	saveCurrentConfiguration: () =>
		set((state) => {
			const modelsSnapshot = JSON.parse(JSON.stringify(state.models));
			const gaussianCount = state.models.filter(
				(m) => m.kind === "gaussian"
			).length;
			let name = `${gaussianCount} gaussian`;
			if (gaussianCount === 1) name = "single gaussian";
			else if (gaussianCount === 2) name = "double gaussian";
			else if (gaussianCount === 3) name = "triple gaussian";

			const newConfig: FitConfiguration = {
				id: uuidv4(),
				name,
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
				c.id === id ? { ...c, selected: !c.selected } : c
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
				c.id === id ? { ...c, name: name } : c
			),
		})),
});
