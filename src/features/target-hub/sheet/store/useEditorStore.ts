import type { TargetHubStore } from "../../store";
import { useTargetHubStore } from "../../store";
import type { TargetHubSheetEditorSlice } from "./editorSlice";

const selectEditorSlice = (state: TargetHubStore): TargetHubSheetEditorSlice =>
	state;

export function useEditorStore<T>(
	selector: (slice: TargetHubSheetEditorSlice) => T,
): T {
	return useTargetHubStore((state) => selector(selectEditorSlice(state)));
}

export function getEditorState(): TargetHubSheetEditorSlice {
	return selectEditorSlice(useTargetHubStore.getState());
}
