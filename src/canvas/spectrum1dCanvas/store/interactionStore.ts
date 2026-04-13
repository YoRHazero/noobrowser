import { create } from "zustand";
import type {
	Spectrum1DCanvasFitHandleDrag,
	Spectrum1DCanvasTooltipData,
} from "../shared/types";

export interface Spectrum1DCanvasInteractionStore {
	fitHandleDrag: Spectrum1DCanvasFitHandleDrag | null;
	hoverData: Spectrum1DCanvasTooltipData | null;
	clearFitHandleDrag: () => void;
	clearHoverData: () => void;
	resetInteractionState: () => void;
	setFitHandleDrag: (drag: Spectrum1DCanvasFitHandleDrag | null) => void;
	setHoverData: (hoverData: Spectrum1DCanvasTooltipData | null) => void;
}

const EMPTY_INTERACTION_STATE = {
	fitHandleDrag: null,
	hoverData: null,
};

export const useSpectrum1DCanvasInteractionStore =
	create<Spectrum1DCanvasInteractionStore>()((set) => ({
		...EMPTY_INTERACTION_STATE,
		clearFitHandleDrag: () => set({ fitHandleDrag: null }),
		clearHoverData: () => set({ hoverData: null }),
		resetInteractionState: () => set(EMPTY_INTERACTION_STATE),
		setFitHandleDrag: (fitHandleDrag) => set({ fitHandleDrag }),
		setHoverData: (hoverData) => set({ hoverData }),
	}));

export function resetSpectrum1DCanvasInteractionStore() {
	useSpectrum1DCanvasInteractionStore.getState().resetInteractionState();
}
