"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSourcePosition } from "@/hooks/query/source";
import { useSourceStore } from "@/stores/source";
import { useTargetHubFootprints } from "../../hooks/useTargetHubFootprints";
import type { TargetHubExtractionDraft } from "../../shared/types";
import { useTargetHubStore } from "../../store";
import { targetHubSheetLocalDefaults } from "../store/sheetSlice";
import { formatPositionValue } from "../utils";

interface ExtractionSettingsFormState {
	apertureSize: string;
	waveMinUm: string;
	waveMaxUm: string;
}

export function useSourceEditorPanel() {
	const {
		editorMode,
		createDraft,
		extractionDraft,
		enterCreateMode,
		returnToDetailMode,
		setEditorMode,
		setCreateDraftField,
		setCreateDraftImageRef,
		setExtractionDraft,
		toggleCreateDraftVisibility,
		resetCreateDraft,
	} = useTargetHubStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
			createDraft: state.createDraft,
			extractionDraft: state.extractionDraft,
			enterCreateMode: state.enterCreateMode,
			returnToDetailMode: state.returnToDetailMode,
			setEditorMode: state.setEditorMode,
			setCreateDraftField: state.setCreateDraftField,
			setCreateDraftImageRef: state.setCreateDraftImageRef,
			setExtractionDraft: state.setExtractionDraft,
			toggleCreateDraftVisibility: state.toggleCreateDraftVisibility,
			resetCreateDraft: state.resetCreateDraft,
		})),
	);
	const {
		activeSourceId,
		sources,
		clearActiveSource,
		commitSourceSpectrumExtraction,
		createSource,
		setSourceImageRef,
		setSourcePosition,
		setSourceVisibility,
	} = useSourceStore(
		useShallow((state) => ({
			activeSourceId: state.activeSourceId,
			sources: state.sources,
			clearActiveSource: state.clearActiveSource,
			commitSourceSpectrumExtraction: state.commitSourceSpectrumExtraction,
			createSource: state.createSource,
			setSourceImageRef: state.setSourceImageRef,
			setSourcePosition: state.setSourcePosition,
			setSourceVisibility: state.setSourceVisibility,
		})),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const {
		footprints,
		selectedFootprint,
		selectedFootprintId: overviewSelectedFootprintId,
	} = useTargetHubFootprints();
	const isDetail = editorMode === "detail" && activeSource !== null;
	const canReturn = editorMode === "create" && activeSourceId !== null;
	const draftRa =
		createDraft.position.ra.trim().length > 0 &&
		Number.isFinite(Number(createDraft.position.ra))
			? Number(createDraft.position.ra)
			: null;
	const draftDec =
		createDraft.position.dec.trim().length > 0 &&
		Number.isFinite(Number(createDraft.position.dec))
			? Number(createDraft.position.dec)
			: null;
	const canSubmit =
		editorMode === "create" && draftRa !== null && draftDec !== null;
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
	const currentVisibility = isDetail
		? activeSource.visibility
		: createDraft.visibility;
	const getFootprintIdForBasename = (refBasename: string | null) =>
		refBasename === null
			? null
			: (footprints.find((footprint) => footprint.refBasename === refBasename)
					?.id ?? null);
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
	const setCreateDraftPosition = (x: number | null, y: number | null) => {
		useTargetHubStore.setState((state) => ({
			createDraft: {
				...state.createDraft,
				position: {
					...state.createDraft.position,
					x,
					y,
				},
			},
		}));
	};
	const applyFootprintSelection = (imageRef: {
		refBasename: string | null;
		footprintId: string | null;
	}) => {
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
	const [isExtractionSettingsOpen, setExtractionSettingsOpen] = useState(false);
	const [extractionSettingsForm, setExtractionSettingsForm] =
		useState<ExtractionSettingsFormState>(() =>
			createExtractionSettingsFormState(extractionDraft),
		);
	const parsedApertureSize = parseExtractionSettingValue(
		extractionSettingsForm.apertureSize,
	);
	const parsedWaveMinUm = parseExtractionSettingValue(
		extractionSettingsForm.waveMinUm,
	);
	const parsedWaveMaxUm = parseExtractionSettingValue(
		extractionSettingsForm.waveMaxUm,
	);
	const extractionSaveDisabledReason =
		parsedApertureSize === null ||
		parsedWaveMinUm === null ||
		parsedWaveMaxUm === null
			? "All extraction settings must be numbers."
			: getExtractionDraftValidationReason({
					apertureSize: parsedApertureSize,
					waveMinUm: parsedWaveMinUm,
					waveMaxUm: parsedWaveMaxUm,
				});
	const fetchSpectrumDisabledReason =
		!isDetail ||
		activeSource.position.ra === null ||
		activeSource.position.dec === null
			? "Source position is incomplete."
			: activeSource.spectrum.status === "pending"
				? "Spectrum fetch is already running."
				: getExtractionDraftValidationReason(extractionDraft);

	useEffect(() => {
		if (!isExtractionSettingsOpen) {
			setExtractionSettingsForm(
				createExtractionSettingsFormState(extractionDraft),
			);
		}
	}, [extractionDraft, isExtractionSettingsOpen]);

	return {
		header: {
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
		},
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
				: createDraft.position.ra || "—",
			decValue: isDetail
				? formatPositionValue(activeSource.position.dec, 5)
				: createDraft.position.dec || "—",
			draftRa: createDraft.position.ra,
			draftDec: createDraft.position.dec,
			onRaChange: (value: string) => setCreateDraftField("ra", value),
			onDecChange: (value: string) => setCreateDraftField("dec", value),
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
		extraction: {
			isSettingsOpen: isExtractionSettingsOpen,
			apertureSize: extractionSettingsForm.apertureSize,
			waveMinUm: extractionSettingsForm.waveMinUm,
			waveMaxUm: extractionSettingsForm.waveMaxUm,
			canSave: extractionSaveDisabledReason === null,
			saveDisabledReason: extractionSaveDisabledReason,
			onOpenChange: (open: boolean) => {
				if (open) {
					setExtractionSettingsForm(
						createExtractionSettingsFormState(extractionDraft),
					);
				}
				setExtractionSettingsOpen(open);
			},
			onApertureSizeChange: (value: string) =>
				setExtractionSettingsForm((state) => ({
					...state,
					apertureSize: value,
				})),
			onWaveMinUmChange: (value: string) =>
				setExtractionSettingsForm((state) => ({
					...state,
					waveMinUm: value,
				})),
			onWaveMaxUmChange: (value: string) =>
				setExtractionSettingsForm((state) => ({
					...state,
					waveMaxUm: value,
				})),
			onSave: () => {
				if (
					parsedApertureSize === null ||
					parsedWaveMinUm === null ||
					parsedWaveMaxUm === null ||
					extractionSaveDisabledReason !== null
				) {
					return;
				}

				setExtractionDraft({
					apertureSize: parsedApertureSize,
					waveMinUm: parsedWaveMinUm,
					waveMaxUm: parsedWaveMaxUm,
				});
				setExtractionSettingsOpen(false);
			},
			onReset: () => {
				setExtractionSettingsForm(
					createExtractionSettingsFormState(
						targetHubSheetLocalDefaults.DEFAULT_EXTRACTION_DRAFT,
					),
				);
			},
		},
		spectrum: {
			canFetch: fetchSpectrumDisabledReason === null,
			fetchDisabledReason: fetchSpectrumDisabledReason,
			onFetch: () => {
				if (!isDetail || fetchSpectrumDisabledReason !== null) {
					return;
				}

				commitSourceSpectrumExtraction(activeSource.id, {
					apertureSize: extractionDraft.apertureSize,
					waveMinUm: extractionDraft.waveMinUm,
					waveMaxUm: extractionDraft.waveMaxUm,
				});
			},
		},
		actions: {
			overviewVisible: currentVisibility.overview,
			inspectorVisible: currentVisibility.inspector,
			onToggleOverview: () => {
				if (isDetail) {
					setSourceVisibility(
						activeSource.id,
						"overview",
						!currentVisibility.overview,
					);
					return;
				}

				toggleCreateDraftVisibility("overview");
			},
			onToggleInspector: () => {
				if (isDetail) {
					setSourceVisibility(
						activeSource.id,
						"inspector",
						!currentVisibility.inspector,
					);
					return;
				}

				toggleCreateDraftVisibility("inspector");
			},
		},
	};
}

function createExtractionSettingsFormState(
	extractionDraft: TargetHubExtractionDraft,
): ExtractionSettingsFormState {
	return {
		apertureSize: extractionDraft.apertureSize.toString(),
		waveMinUm: extractionDraft.waveMinUm.toString(),
		waveMaxUm: extractionDraft.waveMaxUm.toString(),
	};
}

function parseExtractionSettingValue(value: string): number | null {
	const trimmedValue = value.trim();
	if (trimmedValue.length === 0) {
		return null;
	}

	const parsedValue = Number(trimmedValue);
	return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getExtractionDraftValidationReason(
	extractionDraft: TargetHubExtractionDraft,
): string | null {
	if (extractionDraft.apertureSize <= 0) {
		return "Aperture must be greater than 0.";
	}

	if (extractionDraft.waveMinUm >= extractionDraft.waveMaxUm) {
		return "Wave min must be smaller than wave max.";
	}

	return null;
}
