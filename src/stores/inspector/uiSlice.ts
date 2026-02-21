import type { StateCreator } from "zustand";
import type { InspectorState } from "./index";

export interface UiSlice {
	showCutout: boolean;
	goToCutoutRequested: boolean;
	counterpartVisible: boolean;
	followRoiCamera: boolean;
	emissionMaskMode: "hidden" | "individual" | "total";
	emissionMaskThreshold: number;

	setShowCutout: (show: boolean) => void;
	setGoToCutoutRequested: (requested: boolean) => void;
	setCounterpartVisible: (visible: boolean) => void;
	setFollowRoiCamera: (follow: boolean) => void;
	setEmissionMaskMode: (mode: "hidden" | "individual" | "total") => void;
	setEmissionMaskThreshold: (threshold: number) => void;
}

export const createUiSlice: StateCreator<InspectorState, [], [], UiSlice> = (
	set,
) => ({
	showCutout: true,
	goToCutoutRequested: false,
	counterpartVisible: true,
	followRoiCamera: false,
	emissionMaskMode: "hidden",
	emissionMaskThreshold: 2,

	setShowCutout: (show) => set({ showCutout: show }),
	setGoToCutoutRequested: (requested) =>
		set({ goToCutoutRequested: requested }),
	setCounterpartVisible: (visible) => set({ counterpartVisible: visible }),
	setFollowRoiCamera: (follow) => set({ followRoiCamera: follow }),
	setEmissionMaskMode: (mode) => set({ emissionMaskMode: mode }),
	setEmissionMaskThreshold: (threshold) =>
		set({ emissionMaskThreshold: threshold }),
});
