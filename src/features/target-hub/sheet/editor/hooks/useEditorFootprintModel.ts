"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourcePosition } from "@/hooks/query/source";
import { useSourceStore } from "@/stores/source";
import { useEditorStore } from "../../store/useEditorStore";
import { formatPositionValue } from "../../utils";
import { useFootprints } from "./useFootprints";

interface FootprintSelection {
	refBasename: string | null;
	footprintId: string | null;
}

function parseDraftCoordinate(value: string): number | null {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return null;
	}

	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
}

export interface EditorFootprintModel {
	value: string | null;
	options: Array<{
		label: string;
		value: string;
		tooltip: string | null;
	}>;
	canSyncCurrentFootprint: boolean;
	onChange: (refBasename: string | null) => void;
	onSyncCurrentFootprint: () => void;
}

export interface EditorImagePositionModel {
	xValue: string;
	yValue: string;
	canResolveXY: boolean;
	isResolvingXY: boolean;
	onResolveXY: () => Promise<void> | void;
}

export function useEditorFootprintModel(): {
	footprint: EditorFootprintModel;
	imagePosition: EditorImagePositionModel;
} {
	const {
		editorMode,
		createDraft,
		setCreateDraftPosition,
		setCreateDraftImageRef,
	} = useEditorStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
			createDraft: state.createDraft,
			setCreateDraftPosition: state.setCreateDraftPosition,
			setCreateDraftImageRef: state.setCreateDraftImageRef,
		})),
	);
	const { activeSourceId, sources, setSourceImageRef, setSourcePosition } =
		useSourceStore(
			useShallow((state) => ({
				activeSourceId: state.activeSourceId,
				sources: state.sources,
				setSourceImageRef: state.setSourceImageRef,
				setSourcePosition: state.setSourcePosition,
			})),
		);
	const {
		footprints,
		selectedFootprint,
		selectedFootprintId: overviewSelectedFootprintId,
	} = useFootprints();

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const isDetail = editorMode === "detail" && activeSource !== null;
	const draftRa = parseDraftCoordinate(createDraft.position.ra);
	const draftDec = parseDraftCoordinate(createDraft.position.dec);

	const footprintOptions = footprints.flatMap((footprint) =>
		footprint.refBasename
			? [
					{
						label: `Footprint ${footprint.id}`,
						value: footprint.refBasename,
						tooltip: footprint.refBasename,
					},
				]
			: [],
	);
	const getFootprintIdForBasename = (refBasename: string | null) =>
		refBasename === null
			? null
			: (footprints.find((footprint) => footprint.refBasename === refBasename)
					?.id ?? null);
	const currentRefBasename = isDetail
		? activeSource.imageRef.refBasename
		: createDraft.imageRef.refBasename;
	const selectedFootprintRefBasename = selectedFootprint?.refBasename ?? null;
	const selectedFootprintImageRef = selectedFootprint
		? {
				refBasename: selectedFootprint.refBasename,
				footprintId: selectedFootprint.id,
			}
		: null;
	const currentDraftFootprintId =
		createDraft.imageRef.footprintId ??
		getFootprintIdForBasename(createDraft.imageRef.refBasename) ??
		overviewSelectedFootprintId ??
		null;
	const canResolveXY = isDetail
		? activeSource.imageRef.footprintId !== null &&
			activeSource.position.ra !== null &&
			activeSource.position.dec !== null
		: draftRa !== null && draftDec !== null;
	const sourcePositionQuery = useSourcePosition({
		selectedFootprintId: isDetail
			? (activeSource.imageRef.footprintId ?? undefined)
			: (currentDraftFootprintId ?? undefined),
		ra: isDetail
			? (activeSource.position.ra ?? undefined)
			: (draftRa ?? undefined),
		dec: isDetail
			? (activeSource.position.dec ?? undefined)
			: (draftDec ?? undefined),
		ref_basename: isDetail
			? (activeSource.imageRef.refBasename ?? undefined)
			: (createDraft.imageRef.refBasename ?? undefined),
		enabled: false,
	});
	const applyFootprintSelection = (imageRef: FootprintSelection) => {
		if (isDetail) {
			setSourcePosition(activeSource.id, {
				x: null,
				y: null,
			});
			setSourceImageRef(activeSource.id, imageRef);
			return;
		}

		setCreateDraftPosition(null, null);
		setCreateDraftImageRef(imageRef);
	};

	return {
		footprint: {
			value: currentRefBasename,
			options: footprintOptions,
			canSyncCurrentFootprint:
				selectedFootprintRefBasename !== null &&
				selectedFootprintRefBasename !== currentRefBasename,
			onChange: (refBasename: string | null) => {
				applyFootprintSelection({
					refBasename,
					footprintId: getFootprintIdForBasename(refBasename),
				});
			},
			onSyncCurrentFootprint: () => {
				if (!selectedFootprintImageRef) {
					return;
				}

				applyFootprintSelection(selectedFootprintImageRef);
			},
		},
		imagePosition: {
			xValue: formatPositionValue(
				isDetail ? activeSource.position.x : createDraft.position.x,
				1,
			),
			yValue: formatPositionValue(
				isDetail ? activeSource.position.y : createDraft.position.y,
				1,
			),
			canResolveXY,
			isResolvingXY: sourcePositionQuery.isFetching,
			onResolveXY: async () => {
				if (!canResolveXY) {
					return;
				}

				const response = await sourcePositionQuery.refetch();
				if (!response.data) {
					return;
				}

				if (isDetail) {
					setSourcePosition(activeSource.id, {
						x: response.data.x,
						y: response.data.y,
					});
					setSourceImageRef(activeSource.id, {
						refBasename: response.data.ref_basename,
						footprintId:
							response.data.group_id ??
							getFootprintIdForBasename(response.data.ref_basename) ??
							activeSource.imageRef.footprintId,
					});
					return;
				}

				setCreateDraftPosition(response.data.x, response.data.y);
				setCreateDraftImageRef({
					refBasename: response.data.ref_basename,
					footprintId:
						response.data.group_id ??
						getFootprintIdForBasename(response.data.ref_basename) ??
						currentDraftFootprintId,
				});
			},
		},
	};
}
