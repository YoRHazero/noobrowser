// stores/fit.ts
import { create } from "zustand";
import { DEFAULT_COLOR } from "@/components/ui/color-chooser";
import type {
	FitGaussianModel,
	FitLinearModel,
	FitModel,
	FitModelType,
	FitRange,
	WaveFrame,
} from "@/stores/stores-types";
import { normalizeModels, normalizeRange } from "@/stores/stores-utils";

export interface FitState {
	waveFrame: WaveFrame;
	models: FitModel[];

	setWaveFrame: (frame: WaveFrame) => void;

	ensureInitialModels: (range: FitRange) => void;

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
}

/* -------------------------------- store ----------------------------------- */

export const useFitStore = create<FitState>()((set, get) => ({
	waveFrame: "observe",
	models: [],

	setWaveFrame: (frame) => set({ waveFrame: frame }),

	ensureInitialModels: (range) => {
		const state = get();
		if (state.models.length > 0) return;

		state.addLinearModel(range);
		state.addGaussianModel(range);
	},

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
		return get().models.filter((m) => m.kind === "linear") as FitLinearModel[];
	},

	filterActivatedModel: () => {
		return get().models.filter((m) => m.active);
	},
}));
