// stores/fit.ts
import { create } from "zustand";
import { DEFAULT_COLOR } from "@/components/ui/color-chooser";

export type WaveFrame = "observe" | "rest";

export type FitModelType = "linear" | "gaussian";

type FitRange = {
    min: number; // observed frame, µm
    max: number; // observed frame, µm
};

interface BaseFitModel {
    id: number;            // 1-based index over all models (linear first, then gaussian)
    kind: FitModelType;
    name: string;
    active: boolean;
    subtracted: boolean;  // whether subtract this model from the spectrum in slice view
    range: FitRange;       // observed frame, µm
    color: string;      // Hex color code
}

export interface FitLinearModel extends BaseFitModel {
    kind: "linear";
    k: number;
    b: number;
    x0: number;            // observed frame, µm
}

export interface FitGaussianModel extends BaseFitModel {
    kind: "gaussian";
    amplitude: number;
    mu: number;            // observed frame, µm
    sigma: number;         // observed frame, µm
}

export type FitModel = FitLinearModel | FitGaussianModel;

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
    toggleActive: (id: number, active: boolean) => void;

    filterModel: (predicate: (model: FitModel) => boolean) => FitModel[];
    filterGaussianModel: () => FitGaussianModel[];
    filterLinearModel: () => FitLinearModel[];
    filterActivatedModel: () => FitModel[];
}

/* ------------------------------ helpers ----------------------------------- */

function normalizeRange(range: FitRange): FitRange {
    const min = Math.min(range.min, range.max);
    const max = Math.max(range.min, range.max);
    return { min, max };
}

function isAutoName(name: string, base: "Linear" | "Gaussian"): boolean {
    const re = new RegExp(`^${base} \\d+$`);
    return re.test(name);
}

/**
 * Normalize:
 * - linear models first, then gaussian models
 * - reassign id as 1..N
 * - auto rename "Linear N" / "Gaussian N"
 * - custom names stay untouched
 */
function normalizeModels(models: FitModel[]): FitModel[] {
    const linears = models.filter((m) => m.kind === "linear") as FitLinearModel[];
    const gaussians = models.filter((m) => m.kind === "gaussian") as FitGaussianModel[];

    let nextId = 1;
    let linearIndex = 1;
    let gaussianIndex = 1;

    const result: FitModel[] = [];

    for (const m of linears) {
        const id = nextId++;
        const idx = linearIndex++;
        const name = isAutoName(m.name, "Linear") ? `Linear ${idx}` : m.name;
        result.push({
            ...m,
            id,
            name,
            kind: "linear",
            range: normalizeRange(m.range),
        });
    }

    for (const m of gaussians) {
        const id = nextId++;
        const idx = gaussianIndex++;
        const name = isAutoName(m.name, "Gaussian") ? `Gaussian ${idx}` : m.name;
        result.push({
            ...m,
            id,
            name,
            kind: "gaussian",
            range: normalizeRange(m.range),
        });
    }

    return result;
}

/* -------------------------------- store ----------------------------------- */

export const useFitStore = create<FitState>()((set, get) => ({
    waveFrame: "observe",
    models: [],

    setWaveFrame: (frame) => set({ waveFrame: frame }),

    // 使用 addLinearModel / addGaussianModel 来初始化
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
                sigma: 0.0001, // 0.0001 µm = 1 Å
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
        return get().models.filter((m) => m.kind === "gaussian") as FitGaussianModel[];
    },

    filterLinearModel: () => {
        return get().models.filter((m) => m.kind === "linear") as FitLinearModel[];
    },

    filterActivatedModel: () => {
        return get().models.filter((m) => m.active);
    },
}));
