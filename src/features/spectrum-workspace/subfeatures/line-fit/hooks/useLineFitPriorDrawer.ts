"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";
import type { FitPrior, PriorType } from "@/hooks/query/fit/schemas";
import { useSpectrumWorkspaceSource } from "../../../hooks";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";
import { useSpectrumWorkspaceStore } from "../../../store";
import type { SpectrumWorkspaceFitConfiguration } from "../store";
import {
	createDefaultLineFitPrior,
	formatLineFitNumber,
	fromLineFitDisplayWavelength,
	getLineFitParameterValue,
	getLineFitPriorParameters,
	toLineFitDisplayWavelength,
	validateLineFitPrior,
} from "../utils";

export type LineFitPriorDrawerPriorType = PriorType | "Default";

export interface LineFitPriorDrawerModelOptionModel {
	modelId: number;
	name: string;
	hasPrior: boolean;
	selected: boolean;
	onSelect: () => void;
}

export interface LineFitPriorDrawerParameterModel {
	modelId: number;
	paramName: string;
	label: string;
	currentValue: string;
	priorType: LineFitPriorDrawerPriorType;
	selected: boolean;
	onSelect: () => void;
}

export interface LineFitPriorDrawerReferenceOptionModel {
	value: string;
	label: string;
	modelId: number;
	modelName: string;
	paramName: string;
	paramLabel: string;
}

export interface LineFitPriorDrawerEditorModel {
	modelName: string;
	paramName: string;
	paramLabel: string;
	currentValue: string;
	unitLabel: string | null;
	type: LineFitPriorDrawerPriorType;
	draft: Record<string, string>;
	referenceOptions: LineFitPriorDrawerReferenceOptionModel[];
	validationError: string | null;
	onTypeChange: (type: LineFitPriorDrawerPriorType) => void;
	onDraftChange: (field: string, value: string) => void;
}

export interface LineFitPriorDrawerModel {
	isOpen: boolean;
	configurationName: string;
	models: LineFitPriorDrawerModelOptionModel[];
	parameters: LineFitPriorDrawerParameterModel[];
	editor: LineFitPriorDrawerEditorModel | null;
	canClearActivePriors: boolean;
	open: (configurationId: string) => void;
	close: () => void;
	onOpenChange: (open: boolean) => void;
	onClearActivePriors: () => void;
}

interface EditingTarget {
	modelId: number;
	paramName: string;
}

const PARAMETER_LABELS: Record<string, string> = {
	amplitude: "amplitude",
	mu: "mu",
	sigma: "sigma",
	k: "k",
	b: "b",
};

function getDisplayUnitLabel(
	paramName: string,
	display: Pick<SpectrumWorkspaceWavelengthDisplayState, "wavelengthUnit">,
): string | null {
	if (isWavelengthLikeParameter(paramName)) {
		return display.wavelengthUnit;
	}

	return null;
}

function isWavelengthLikeParameter(paramName: string): boolean {
	return paramName === "mu" || paramName === "sigma";
}

function toDisplayNumber(
	paramName: string,
	value: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	return isWavelengthLikeParameter(paramName)
		? toLineFitDisplayWavelength(value, display)
		: value;
}

function fromDisplayNumber(
	paramName: string,
	value: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	return isWavelengthLikeParameter(paramName)
		? fromLineFitDisplayWavelength(value, display)
		: value;
}

function toDisplaySpreadNumber(
	paramName: string,
	value: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	return isWavelengthLikeParameter(paramName)
		? toLineFitDisplayWavelength(value, display)
		: value;
}

function fromDisplaySpreadNumber(
	paramName: string,
	value: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	return isWavelengthLikeParameter(paramName)
		? fromLineFitDisplayWavelength(value, display)
		: value;
}

function numericString(value: number | undefined): string {
	if (value === undefined || !Number.isFinite(value)) {
		return "";
	}

	return `${value}`;
}

function parseFiniteNumber(value: string): number | null {
	const trimmedValue = value.trim();
	if (trimmedValue.length === 0) {
		return null;
	}

	const parsed = Number(trimmedValue);
	return Number.isFinite(parsed) ? parsed : null;
}

function getPriorType(
	prior: FitPrior | undefined,
): LineFitPriorDrawerPriorType {
	return prior?.type ?? "Default";
}

function getReferenceKey(prior: FitPrior, fallbackParamName: string): string {
	if (prior.type !== "Deterministic") {
		return "";
	}

	return `${prior.refModelId}:${prior.refParam ?? fallbackParamName}`;
}

function createDraftFromPrior({
	prior,
	paramName,
	display,
}: {
	prior: FitPrior | undefined;
	paramName: string;
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
}): Record<string, string> {
	if (!prior) {
		return {};
	}

	if (prior.type === "Fixed") {
		return {
			value: numericString(toDisplayNumber(paramName, prior.value, display)),
		};
	}

	if (prior.type === "Normal") {
		return {
			mu: numericString(toDisplayNumber(paramName, prior.mu, display)),
			sigma: numericString(
				toDisplaySpreadNumber(paramName, prior.sigma, display),
			),
		};
	}

	if (prior.type === "Uniform") {
		return {
			lower: numericString(toDisplayNumber(paramName, prior.lower, display)),
			upper: numericString(toDisplayNumber(paramName, prior.upper, display)),
		};
	}

	if (prior.type === "TruncatedNormal") {
		return {
			mu: numericString(toDisplayNumber(paramName, prior.mu, display)),
			sigma: numericString(
				toDisplaySpreadNumber(paramName, prior.sigma, display),
			),
			lower: numericString(
				prior.lower === undefined
					? undefined
					: toDisplayNumber(paramName, prior.lower, display),
			),
			upper: numericString(
				prior.upper === undefined
					? undefined
					: toDisplayNumber(paramName, prior.upper, display),
			),
		};
	}

	return {
		mode: prior.mode,
		value: numericString(
			prior.mode === "add"
				? toDisplaySpreadNumber(paramName, prior.value, display)
				: prior.value,
		),
		reference: getReferenceKey(prior, paramName),
	};
}

function createPriorFromDraft({
	type,
	draft,
	paramName,
	display,
}: {
	type: LineFitPriorDrawerPriorType;
	draft: Record<string, string>;
	paramName: string;
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
}): { prior?: FitPrior; error: string | null } {
	if (type === "Default") {
		return { prior: undefined, error: null };
	}

	if (type === "Fixed") {
		const value = parseFiniteNumber(draft.value ?? "");
		return value === null
			? { error: "Fixed value must be a finite number." }
			: {
					prior: {
						type,
						value: fromDisplayNumber(paramName, value, display),
					},
					error: null,
				};
	}

	if (type === "Normal") {
		const mu = parseFiniteNumber(draft.mu ?? "");
		const sigma = parseFiniteNumber(draft.sigma ?? "");
		return mu === null || sigma === null
			? { error: "Normal mu and sigma must be finite numbers." }
			: {
					prior: {
						type,
						mu: fromDisplayNumber(paramName, mu, display),
						sigma: fromDisplaySpreadNumber(paramName, sigma, display),
					},
					error: null,
				};
	}

	if (type === "Uniform") {
		const lower = parseFiniteNumber(draft.lower ?? "");
		const upper = parseFiniteNumber(draft.upper ?? "");
		return lower === null || upper === null
			? { error: "Uniform lower and upper must be finite numbers." }
			: {
					prior: {
						type,
						lower: fromDisplayNumber(paramName, lower, display),
						upper: fromDisplayNumber(paramName, upper, display),
					},
					error: null,
				};
	}

	if (type === "TruncatedNormal") {
		const mu = parseFiniteNumber(draft.mu ?? "");
		const sigma = parseFiniteNumber(draft.sigma ?? "");
		const lower =
			(draft.lower ?? "").trim().length === 0
				? undefined
				: parseFiniteNumber(draft.lower ?? "");
		const upper =
			(draft.upper ?? "").trim().length === 0
				? undefined
				: parseFiniteNumber(draft.upper ?? "");

		if (mu === null || sigma === null || lower === null || upper === null) {
			return {
				error:
					"Truncated normal mu and sigma must be finite numbers; bounds may be blank.",
			};
		}

		return {
			prior: {
				type,
				mu: fromDisplayNumber(paramName, mu, display),
				sigma: fromDisplaySpreadNumber(paramName, sigma, display),
				lower:
					lower === undefined
						? undefined
						: fromDisplayNumber(paramName, lower, display),
				upper:
					upper === undefined
						? undefined
						: fromDisplayNumber(paramName, upper, display),
			},
			error: null,
		};
	}

	const value = parseFiniteNumber(draft.value ?? "");
	const [refModelIdText, refParam] = (draft.reference ?? "").split(":");
	const refModelId = Number.parseInt(refModelIdText ?? "", 10);
	const mode = draft.mode === "multiply" ? "multiply" : "add";

	if (value === null || !Number.isFinite(refModelId) || !refParam) {
		return {
			error:
				"Deterministic prior needs a finite value and reference parameter.",
		};
	}

	return {
		prior: {
			type,
			mode,
			value:
				mode === "add"
					? fromDisplaySpreadNumber(paramName, value, display)
					: value,
			refModelId,
			refParam,
		},
		error: null,
	};
}

function findConfiguration(
	configurations: readonly SpectrumWorkspaceFitConfiguration[],
	configurationId: string | null,
): SpectrumWorkspaceFitConfiguration | null {
	return configurationId === null
		? null
		: (configurations.find(
				(configuration) => configuration.id === configurationId,
			) ?? null);
}

function getCurrentPrior(
	configuration: SpectrumWorkspaceFitConfiguration | null,
	target: EditingTarget | null,
): FitPrior | undefined {
	if (!configuration || !target) {
		return undefined;
	}

	return configuration.priorsByModelId?.[target.modelId]?.[target.paramName];
}

function getActiveModels(
	configuration: SpectrumWorkspaceFitConfiguration | null,
): Spectrum1DCanvasFitModel[] {
	return configuration?.models.filter((model) => model.active) ?? [];
}

function createReferenceOptions(
	models: readonly Spectrum1DCanvasFitModel[],
	target: EditingTarget,
): LineFitPriorDrawerReferenceOptionModel[] {
	return models.flatMap((model) =>
		getLineFitPriorParameters(model)
			.filter(
				(paramName) =>
					model.id !== target.modelId || paramName !== target.paramName,
			)
			.map((paramName) => ({
				value: `${model.id}:${paramName}`,
				label: `${model.label} / ${PARAMETER_LABELS[paramName] ?? paramName}`,
				modelId: model.id,
				modelName: model.label,
				paramName,
				paramLabel: PARAMETER_LABELS[paramName] ?? paramName,
			})),
	);
}

function createDefaultPriorForType({
	type,
	model,
	paramName,
	referenceOptions,
}: {
	type: PriorType;
	model: Spectrum1DCanvasFitModel;
	paramName: string;
	referenceOptions: readonly LineFitPriorDrawerReferenceOptionModel[];
}): FitPrior {
	const currentValue = getLineFitParameterValue(model, paramName) ?? 0;
	const preferredReference =
		referenceOptions.find((option) => option.value.endsWith(`:${paramName}`)) ??
		referenceOptions[0];
	const [refModelIdText, refParam] = (preferredReference?.value ?? "").split(
		":",
	);
	const refModelId = Number.parseInt(refModelIdText ?? "", 10);

	return createDefaultLineFitPrior({
		type,
		currentValue,
		refModelId: Number.isFinite(refModelId) ? refModelId : undefined,
		refParam,
	});
}

export function useLineFitPriorDrawer(): LineFitPriorDrawerModel {
	const source = useSpectrumWorkspaceSource();
	const [configurationId, setConfigurationId] = useState<string | null>(null);
	const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
	const [selectedParamName, setSelectedParamName] = useState<string | null>(
		null,
	);
	const [draft, setDraft] = useState<Record<string, string>>({});
	const [validationError, setValidationError] = useState<string | null>(null);
	const sourceId = source?.id ?? null;
	const {
		fitConfigurationsBySourceId,
		redshift,
		wavelengthFrame,
		wavelengthUnit,
		setFitModelPrior,
		clearFitModelPrior,
		clearActiveFitConfigurationPriors,
	} = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			fitConfigurationsBySourceId: state.fitConfigurationsBySourceId,
			redshift: state.redshift,
			wavelengthFrame: state.wavelengthFrame,
			wavelengthUnit: state.wavelengthUnit,
			setFitModelPrior: state.setFitModelPrior,
			clearFitModelPrior: state.clearFitModelPrior,
			clearActiveFitConfigurationPriors:
				state.clearActiveFitConfigurationPriors,
		})),
	);
	const display = useMemo(
		() => ({ redshift, wavelengthFrame, wavelengthUnit }),
		[redshift, wavelengthFrame, wavelengthUnit],
	);
	const configurations = sourceId
		? (fitConfigurationsBySourceId[sourceId] ?? [])
		: [];
	const configuration = useMemo(
		() => findConfiguration(configurations, configurationId),
		[configurationId, configurations],
	);
	const activeModels = useMemo(
		() => getActiveModels(configuration),
		[configuration],
	);
	const selectedModel =
		selectedModelId === null
			? null
			: (activeModels.find((model) => model.id === selectedModelId) ?? null);
	const editingTarget =
		selectedModel && selectedParamName
			? { modelId: selectedModel.id, paramName: selectedParamName }
			: null;
	const currentPrior = getCurrentPrior(configuration, editingTarget);
	const currentType = getPriorType(currentPrior);
	const referenceOptions = useMemo(
		() =>
			editingTarget ? createReferenceOptions(activeModels, editingTarget) : [],
		[activeModels, editingTarget],
	);
	const validReferenceParams = useMemo(
		() => new Set(referenceOptions.map((option) => option.value)),
		[referenceOptions],
	);

	const commitDraft = useCallback(
		({
			target,
			type,
			nextDraft,
		}: {
			target: EditingTarget;
			type: LineFitPriorDrawerPriorType;
			nextDraft: Record<string, string>;
		}) => {
			if (sourceId === null || configurationId === null) {
				return;
			}

			if (type === "Default") {
				clearFitModelPrior(
					sourceId,
					configurationId,
					target.modelId,
					target.paramName,
				);
				setValidationError(null);
				return;
			}

			const result = createPriorFromDraft({
				type,
				draft: nextDraft,
				paramName: target.paramName,
				display,
			});
			if (result.error || !result.prior) {
				setValidationError(result.error);
				return;
			}

			const nextValidationError = validateLineFitPrior({
				prior: result.prior,
				modelId: target.modelId,
				paramName: target.paramName,
				validReferenceParams,
			});
			setValidationError(nextValidationError);

			if (nextValidationError === null) {
				setFitModelPrior(
					sourceId,
					configurationId,
					target.modelId,
					target.paramName,
					result.prior,
				);
			}
		},
		[
			clearFitModelPrior,
			configurationId,
			display,
			setFitModelPrior,
			sourceId,
			validReferenceParams,
		],
	);

	useEffect(() => {
		if (configurationId !== null && configuration === null) {
			setConfigurationId(null);
			setSelectedModelId(null);
			setSelectedParamName(null);
			setDraft({});
			setValidationError(null);
		}
	}, [configuration, configurationId]);

	useEffect(() => {
		if (configurationId === null) {
			return;
		}

		if (activeModels.length === 0) {
			setSelectedModelId(null);
			setSelectedParamName(null);
			setDraft({});
			setValidationError(null);
			return;
		}

		if (
			selectedModelId === null ||
			!activeModels.some((model) => model.id === selectedModelId)
		) {
			setSelectedModelId(activeModels[0].id);
			setSelectedParamName(null);
			setDraft({});
			setValidationError(null);
		}
	}, [activeModels, configurationId, selectedModelId]);

	useEffect(() => {
		if (!selectedModel || selectedParamName === null) {
			return;
		}

		if (!getLineFitPriorParameters(selectedModel).includes(selectedParamName)) {
			setSelectedParamName(null);
			setDraft({});
			setValidationError(null);
		}
	}, [selectedModel, selectedParamName]);

	const selectModel = useCallback((modelId: number) => {
		setSelectedModelId(modelId);
		setSelectedParamName(null);
		setDraft({});
		setValidationError(null);
	}, []);

	const selectParameter = useCallback(
		(paramName: string) => {
			if (!selectedModel) {
				return;
			}

			const prior =
				configuration?.priorsByModelId?.[selectedModel.id]?.[paramName];
			setSelectedParamName(paramName);
			setDraft(createDraftFromPrior({ prior, paramName, display }));
			setValidationError(null);
		},
		[configuration, display, selectedModel],
	);

	const open = useCallback((nextConfigurationId: string) => {
		setConfigurationId(nextConfigurationId);
		setSelectedModelId(null);
		setSelectedParamName(null);
		setDraft({});
		setValidationError(null);
	}, []);

	const close = useCallback(() => {
		setConfigurationId(null);
		setSelectedModelId(null);
		setSelectedParamName(null);
		setDraft({});
		setValidationError(null);
	}, []);

	const onOpenChange = useCallback(
		(openState: boolean) => {
			if (!openState) {
				close();
			}
		},
		[close],
	);

	const handleTypeChange = useCallback(
		(type: LineFitPriorDrawerPriorType) => {
			if (!editingTarget || !selectedModel) {
				return;
			}

			if (type === "Default") {
				setDraft({});
				commitDraft({ target: editingTarget, type, nextDraft: {} });
				return;
			}

			const prior = createDefaultPriorForType({
				type,
				model: selectedModel,
				paramName: editingTarget.paramName,
				referenceOptions,
			});
			const nextDraft = createDraftFromPrior({
				prior,
				paramName: editingTarget.paramName,
				display,
			});
			setDraft(nextDraft);
			commitDraft({ target: editingTarget, type, nextDraft });
		},
		[commitDraft, display, editingTarget, referenceOptions, selectedModel],
	);

	const handleDraftChange = useCallback(
		(field: string, value: string) => {
			if (!editingTarget) {
				return;
			}

			const nextDraft = { ...draft, [field]: value };
			setDraft(nextDraft);
			commitDraft({ target: editingTarget, type: currentType, nextDraft });
		},
		[commitDraft, currentType, draft, editingTarget],
	);

	const onClearActivePriors = useCallback(() => {
		if (sourceId === null || configurationId === null) {
			return;
		}

		clearActiveFitConfigurationPriors(sourceId, configurationId);
		setDraft({});
		setValidationError(null);
	}, [clearActiveFitConfigurationPriors, configurationId, sourceId]);

	const modelOptions = useMemo(
		() =>
			activeModels.map((model) => ({
				modelId: model.id,
				name: model.label,
				hasPrior: Object.keys(
					configuration?.priorsByModelId?.[model.id] ?? {},
				).some((paramName) =>
					getLineFitPriorParameters(model).includes(paramName),
				),
				selected: selectedModelId === model.id,
				onSelect: () => selectModel(model.id),
			})),
		[activeModels, configuration, selectModel, selectedModelId],
	);

	const parameterOptions = useMemo(
		() =>
			selectedModel
				? getLineFitPriorParameters(selectedModel).map((paramName) => {
						const canonicalValue = getLineFitParameterValue(
							selectedModel,
							paramName,
						);
						const displayValue =
							canonicalValue === null
								? null
								: toDisplayNumber(paramName, canonicalValue, display);

						return {
							modelId: selectedModel.id,
							paramName,
							label: PARAMETER_LABELS[paramName] ?? paramName,
							currentValue: formatLineFitNumber(displayValue, 5),
							priorType: getPriorType(
								configuration?.priorsByModelId?.[selectedModel.id]?.[paramName],
							),
							selected: selectedParamName === paramName,
							onSelect: () => selectParameter(paramName),
						};
					})
				: [],
		[configuration, display, selectParameter, selectedModel, selectedParamName],
	);

	const editor =
		editingTarget && selectedModel
			? {
					modelName: selectedModel.label,
					paramName: editingTarget.paramName,
					paramLabel:
						PARAMETER_LABELS[editingTarget.paramName] ??
						editingTarget.paramName,
					currentValue: formatLineFitNumber(
						toDisplayNumber(
							editingTarget.paramName,
							getLineFitParameterValue(
								selectedModel,
								editingTarget.paramName,
							) ?? 0,
							display,
						),
						5,
					),
					unitLabel: getDisplayUnitLabel(editingTarget.paramName, display),
					type: currentType,
					draft,
					referenceOptions,
					validationError,
					onTypeChange: handleTypeChange,
					onDraftChange: handleDraftChange,
				}
			: null;

	const canClearActivePriors = activeModels.some((model) =>
		Object.keys(configuration?.priorsByModelId?.[model.id] ?? {}).some(
			(paramName) => getLineFitPriorParameters(model).includes(paramName),
		),
	);

	return {
		isOpen: configurationId !== null,
		configurationName: configuration?.name ?? "",
		models: modelOptions,
		parameters: parameterOptions,
		editor,
		canClearActivePriors,
		open,
		close,
		onOpenChange,
		onClearActivePriors,
	};
}
