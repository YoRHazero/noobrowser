"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { useEditorStore } from "../../../store";
import { formatPositionValue } from "../../../utils";
import { EDITOR_EMPTY_VALUE } from "../shared/constants";
import type {
	EditorIdentityModel,
	EditorSkyPositionModel,
} from "./editorModels";

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
	const { activeSourceId, sources, setSourceLabel } = useSourceStore(
		useShallow((state) => ({
			activeSourceId: state.activeSourceId,
			sources: state.sources,
			setSourceLabel: state.setSourceLabel,
		})),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const isDetail = editorMode === "detail" && activeSource !== null;
	const activeSourceLabel = activeSource?.label ?? "";
	const activeSourceDraftKey = activeSource
		? `${activeSource.id}:${activeSourceLabel}`
		: "";
	const [detailLabelDraft, setDetailLabelDraft] = useState(activeSourceLabel);

	useEffect(() => {
		if (!activeSourceDraftKey) {
			setDetailLabelDraft("");
			return;
		}

		setDetailLabelDraft(activeSourceLabel);
	}, [activeSourceDraftKey, activeSourceLabel]);

	const handleLabelChange = (value: string) => {
		if (isDetail) {
			setDetailLabelDraft(value);
			return;
		}

		setCreateDraftField("label", value);
	};

	const handleLabelBlur = () => {
		if (!isDetail || !activeSource) {
			return;
		}

		const nextLabel = detailLabelDraft.trim() || undefined;
		if (nextLabel === activeSource.label) {
			return;
		}

		setDetailLabelDraft(nextLabel ?? "");
		setSourceLabel(activeSource.id, nextLabel);
	};

	return {
		identity: {
			isDetail,
			labelValue: isDetail ? detailLabelDraft : createDraft.label,
			idValue: isDetail ? activeSource.id : "Auto",
			onLabelChange: handleLabelChange,
			onLabelBlur: handleLabelBlur,
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
