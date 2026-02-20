import type { StateCreator } from "zustand";
import { DEFAULT_COLOR } from "@/components/ui/color-chooser";
import type { AnalyzerState } from "./index";
import type {
	FitModel,
	FitLinearModel,
	FitGaussianModel,
	FitModelType,
	FitRange,
	FitPrior,
} from "./types";
import { normalizeModels, normalizeRange, updatePriorInModel } from "./utils";

export interface ModelsSlice {
	models: FitModel[];

	ensureInitialModels: (range: FitRange) => void;
	duplicateNameIds: () => number[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		prior: FitPrior | undefined
	) => void;
	addModel: (kind: FitModelType, range: FitRange) => void;
	addLinearModel: (range: FitRange) => void;
	addGaussianModel: (range: FitRange) => void;
	updateModel: (
		id: number,
		patch: Partial<FitLinearModel> | Partial<FitGaussianModel>
	) => void;
	removeModel: (id: number) => void;
	renameModel: (id: number, name: string) => void;
	validateModel: () => void;
	toggleActive: (id: number, active: boolean) => void;
	filterModel: (predicate: (model: FitModel) => boolean) => FitModel[];
	filterGaussianModel: () => FitGaussianModel[];
	filterLinearModel: () => FitLinearModel[];
	filterActivatedModel: () => FitModel[];
}

export const createModelsSlice: StateCreator<
	AnalyzerState,
	[],
	[],
	ModelsSlice
> = (set, get) => ({
	models: [],

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
				model.id === id ? { ...model, name } : model
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
				model.id === id ? { ...model, active } : model
			),
		})),

	filterModel: (predicate) => {
		return get().models.filter(predicate);
	},

	filterGaussianModel: () => {
		return get().models.filter(
			(m) => m.kind === "gaussian"
		) as FitGaussianModel[];
	},

	filterLinearModel: () => {
		return get().models.filter(
			(m) => m.kind === "linear"
		) as FitLinearModel[];
	},

	filterActivatedModel: () => {
		return get().models.filter((m) => m.active);
	},
});
