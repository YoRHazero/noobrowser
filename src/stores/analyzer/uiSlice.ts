import type { StateCreator } from "zustand";
import type { AnalyzerState } from "./index";

export interface UiSlice {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export const createUiSlice: StateCreator<AnalyzerState, [], [], UiSlice> = (set) => ({
	activeTab: "trace",
	setActiveTab: (tab) => set({ activeTab: tab }),
});
