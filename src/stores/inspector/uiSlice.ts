import type { StateCreator } from "zustand";
import type { InspectorState } from "./index";

export interface UiSlice {
	showCutout: boolean;
	goToCutoutRequested: boolean;
	counterpartVisible: boolean;
	followRoiCamera: boolean;

	setShowCutout: (show: boolean) => void;
	setGoToCutoutRequested: (requested: boolean) => void;
	setCounterpartVisible: (visible: boolean) => void;
	setFollowRoiCamera: (follow: boolean) => void;
}

export const createUiSlice: StateCreator<InspectorState, [], [], UiSlice> = (
	set,
) => ({
	showCutout: true,
	goToCutoutRequested: false,
	counterpartVisible: true,
	followRoiCamera: false,

	setShowCutout: (show) => set({ showCutout: show }),
	setGoToCutoutRequested: (requested) =>
		set({ goToCutoutRequested: requested }),
	setCounterpartVisible: (visible) => set({ counterpartVisible: visible }),
	setFollowRoiCamera: (follow) => set({ followRoiCamera: follow }),
});
