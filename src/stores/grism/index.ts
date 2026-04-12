import { create } from "zustand";
import {
	createGrismFootprintSlice,
	type GrismFootprintSlice,
} from "./footprintSlice";

export type GrismStoreState = GrismFootprintSlice;

export type { GrismFootprintSlice } from "./footprintSlice";

export const useGrismStore = create<GrismStoreState>()((...a) => ({
	...createGrismFootprintSlice(...a),
}));
