"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { useEditorStore } from "../../../store";
import { formatPositionValue } from "../../../utils";
import { EDITOR_EMPTY_VALUE } from "../shared/constants";
import type {
	EditorIdentityModel,
	EditorSkyPositionModel,
} from "../shared/types";

export function useEditorIdentityModel(): {
	identity: EditorIdentityModel;
	skyPosition: EditorSkyPositionModel;
} {
	const { editorMode, createDraft, setCreateDraftField } = useEditorStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
			createDraft: state.createDraft,
			setCreateDraftField: state.setCreateDraftField,
		})),
	);
	const { activeSourceId, sources } = useSourceStore(
		useShallow((state) => ({
			activeSourceId: state.activeSourceId,
			sources: state.sources,
		})),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const isDetail = editorMode === "detail" && activeSource !== null;

	return {
		identity: {
			isDetail,
			labelValue: isDetail ? (activeSource.label ?? "") : createDraft.label,
			idValue: isDetail ? activeSource.id : "Auto",
			draftLabel: createDraft.label,
			onLabelChange: (value: string) => setCreateDraftField("label", value),
		},
		skyPosition: {
			isDetail,
			raValue: isDetail
				? formatPositionValue(activeSource.position.ra, 5)
				: createDraft.position.ra || EDITOR_EMPTY_VALUE,
			decValue: isDetail
				? formatPositionValue(activeSource.position.dec, 5)
				: createDraft.position.dec || EDITOR_EMPTY_VALUE,
			draftRa: createDraft.position.ra,
			draftDec: createDraft.position.dec,
			onRaChange: (value: string) => setCreateDraftField("ra", value),
			onDecChange: (value: string) => setCreateDraftField("dec", value),
		},
	};
}
