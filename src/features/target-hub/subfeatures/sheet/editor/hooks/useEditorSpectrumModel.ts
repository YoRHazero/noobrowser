"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import type { TargetHubExtractionDraft } from "../../../../shared/types";
import { sheetEditorLocalDefaults } from "../../store/editorSlice";
import { useEditorStore } from "../../store/useEditorStore";

interface ExtractionSettingsFormState {
	apertureSize: string;
	waveMinUm: string;
	waveMaxUm: string;
}

export interface EditorExtractionModel {
	isSettingsOpen: boolean;
	apertureSize: string;
	waveMinUm: string;
	waveMaxUm: string;
	canSave: boolean;
	saveDisabledReason: string | null;
	onOpenChange: (open: boolean) => void;
	onApertureSizeChange: (value: string) => void;
	onWaveMinUmChange: (value: string) => void;
	onWaveMaxUmChange: (value: string) => void;
	onSave: () => void;
	onReset: () => void;
}

export interface EditorSpectrumModel {
	canFetch: boolean;
	fetchDisabledReason: string | null;
	onFetch: () => void;
}

export interface EditorActionsModel {
	overviewVisible: boolean;
	inspectorVisible: boolean;
	onToggleOverview: () => void;
	onToggleInspector: () => void;
}

export function useEditorSpectrumModel(): {
	extraction: EditorExtractionModel;
	spectrum: EditorSpectrumModel;
	actions: EditorActionsModel;
} {
	const {
		editorMode,
		createDraft,
		extractionDraft,
		setExtractionDraft,
		toggleCreateDraftVisibility,
	} = useEditorStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
			createDraft: state.createDraft,
			extractionDraft: state.extractionDraft,
			setExtractionDraft: state.setExtractionDraft,
			toggleCreateDraftVisibility: state.toggleCreateDraftVisibility,
		})),
	);
	const {
		activeSourceId,
		sources,
		commitSourceSpectrumExtraction,
		setSourceVisibility,
	} = useSourceStore(
		useShallow((state) => ({
			activeSourceId: state.activeSourceId,
			sources: state.sources,
			commitSourceSpectrumExtraction: state.commitSourceSpectrumExtraction,
			setSourceVisibility: state.setSourceVisibility,
		})),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const isDetail = editorMode === "detail" && activeSource !== null;
	const currentVisibility = isDetail
		? activeSource.visibility
		: createDraft.visibility;
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
						sheetEditorLocalDefaults.DEFAULT_EXTRACTION_DRAFT,
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
