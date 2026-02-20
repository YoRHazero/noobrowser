import { create } from "zustand";
import { type FrameSlice, createFrameSlice } from "./frameSlice";
import { type CounterpartSlice, createCounterpartSlice } from "./counterpartSlice";
import { type UiSlice, createUiSlice } from "./uiSlice";

export type InspectorState = FrameSlice & CounterpartSlice & UiSlice;

export const useInspectorStore = create<InspectorState>()((...a) => ({
	...createFrameSlice(...a),
	...createCounterpartSlice(...a),
	...createUiSlice(...a),
}));
