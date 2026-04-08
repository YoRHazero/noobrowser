"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { useEditorStore } from "../../store/useEditorStore";

export interface EditorHeaderModel {
	isDetail: boolean;
	canReturn: boolean;
	canSubmit: boolean;
	onEnterCreateMode: () => void;
	onReturnToDetailMode: () => void;
	onCreateSource: () => void;
}

function parseDraftCoordinate(value: string): number | null {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return null;
	}

	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
}

export function useEditorHeaderModel(): EditorHeaderModel {
	const {
		editorMode,
		createDraft,
		enterCreateMode,
		returnToDetailMode,
		setEditorMode,
		resetCreateDraft,
	} = useEditorStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
			createDraft: state.createDraft,
			enterCreateMode: state.enterCreateMode,
			returnToDetailMode: state.returnToDetailMode,
			setEditorMode: state.setEditorMode,
			resetCreateDraft: state.resetCreateDraft,
		})),
	);
	const { activeSourceId, sources, clearActiveSource, createSource } =
		useSourceStore(
			useShallow((state) => ({
				activeSourceId: state.activeSourceId,
				sources: state.sources,
				clearActiveSource: state.clearActiveSource,
				createSource: state.createSource,
			})),
		);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const isDetail = editorMode === "detail" && activeSource !== null;
	const canReturn = editorMode === "create" && activeSourceId !== null;
	const draftRa = parseDraftCoordinate(createDraft.position.ra);
	const draftDec = parseDraftCoordinate(createDraft.position.dec);
	const canSubmit =
		editorMode === "create" && draftRa !== null && draftDec !== null;

	return {
		isDetail,
		canReturn,
		canSubmit,
		onEnterCreateMode: () => {
			clearActiveSource();
			enterCreateMode();
		},
		onReturnToDetailMode: returnToDetailMode,
		onCreateSource: () => {
			if (!canSubmit) {
				return;
			}

			createSource({
				label: createDraft.label.trim() || undefined,
				position: {
					ra: Number(createDraft.position.ra),
					dec: Number(createDraft.position.dec),
					x: createDraft.position.x,
					y: createDraft.position.y,
				},
				imageRef: {
					...createDraft.imageRef,
				},
				visibility: {
					...createDraft.visibility,
				},
			});

			setEditorMode("detail");
			resetCreateDraft();
		},
	};
}
