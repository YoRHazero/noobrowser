"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasGaussianFitModel,
} from "@/canvas/spectrum1dCanvas";
import type { FitPrior, PriorType } from "@/hooks/query/fit/schemas";
import { useSpectrumWorkspaceSource } from "../../../hooks";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";
import { useSpectrumWorkspaceStore } from "../../../store";
import type { SpectrumWorkspaceFitConfiguration } from "../store";
import {
	createDefaultLineFitPrior,
	createTwoGaussianFwhmAutoPriors,
	formatLineFitNumber,
	fromLineFitDisplayWavelength,
	fwhmKmSToSigmaUm,
	getLineFitParameterValue,
	getLineFitPriorParameters,
	sigmaUmToFwhmKmS,
	toLineFitDisplayWavelength,
	validateLineFitPrior,
} from "../utils";
import type {
	LineFitPriorDrawerModel,
	LineFitPriorDrawerPriorType,
	LineFitPriorDrawerReferenceOptionModel,
} from "./lineFitPriorDrawerModels";

interface EditingTarget {
	modelId: number;
	paramName: string;
}

interface PriorDisplayContext
	extends Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	> {
	useVelocityForSigma: boolean;
	sigmaVelocityMuUm: number | null;
}

const PARAMETER_LABELS: Record<string, string> = {
	amplitude: "amplitude",
	mu: "mu",
	sigma: "sigma",
	k: "k",
	b: "b",
};

const AUTO_FWHM_PRIOR_SIGMA_KM_S = 500;

function getDisplayUnitLabel(
	paramName: string,
	display: PriorDisplayContext,
): string | null {
	if (shouldUseSigmaVelocity(paramName, display)) {
		return "km/s";
	}

	if (isWavelengthLikeParameter(paramName)) {
		return display.wavelengthUnit;
	}

	return null;
}

function isWavelengthLikeParameter(paramName: string): boolean {
	return paramName === "mu" || paramName === "sigma";
}

function shouldUseSigmaVelocity(
	paramName: string,
	display: PriorDisplayContext,
): boolean {
	return (
		paramName === "sigma" &&
		display.useVelocityForSigma &&
		display.sigmaVelocityMuUm !== null
	);
}

function toDisplayNumber(
	paramName: string,
	value: number,
	display: PriorDisplayContext,
): number | null {
	if (shouldUseSigmaVelocity(paramName, display)) {
		return sigmaUmToFwhmKmS(display.sigmaVelocityMuUm ?? 0, value);
	}

	return isWavelengthLikeParameter(paramName)
		? toLineFitDisplayWavelength(value, display)
		: value;
}

function fromDisplayNumber(
	paramName: string,
	value: number,
	display: PriorDisplayContext,
): number | null {
	if (shouldUseSigmaVelocity(paramName, display)) {
		return fwhmKmSToSigmaUm(display.sigmaVelocityMuUm ?? 0, value);
	}

	return isWavelengthLikeParameter(paramName)
		? fromLineFitDisplayWavelength(value, display)
		: value;
}

function toDisplaySpreadNumber(
	paramName: string,
	value: number,
	display: PriorDisplayContext,
): number | null {
	return isWavelengthLikeParameter(paramName)
		? toDisplayNumber(paramName, value, display)
		: value;
}

function fromDisplaySpreadNumber(
	paramName: string,
	value: number,
	display: PriorDisplayContext,
): number | null {
	return isWavelengthLikeParameter(paramName)
		? fromDisplayNumber(paramName, value, display)
		: value;
}

function numericString(value: number | null | undefined): string {
	if (value === undefined || value === null || !Number.isFinite(value)) {
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
	display: PriorDisplayContext;
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
	display: PriorDisplayContext;
}): { prior?: FitPrior; error: string | null } {
	if (type === "Default") {
		return { prior: undefined, error: null };
	}

	if (type === "Fixed") {
		const value = parseFiniteNumber(draft.value ?? "");
		const canonicalValue =
			value === null ? null : fromDisplayNumber(paramName, value, display);
		return value === null || canonicalValue === null
			? { error: "Fixed value must be a finite number." }
			: {
					prior: {
						type,
						value: canonicalValue,
					},
					error: null,
				};
	}

	if (type === "Normal") {
		const mu = parseFiniteNumber(draft.mu ?? "");
		const sigma = parseFiniteNumber(draft.sigma ?? "");
		const canonicalMu =
			mu === null ? null : fromDisplayNumber(paramName, mu, display);
		const canonicalSigma =
			sigma === null
				? null
				: fromDisplaySpreadNumber(paramName, sigma, display);
		return mu === null ||
			sigma === null ||
			canonicalMu === null ||
			canonicalSigma === null
			? { error: "Normal mu and sigma must be finite numbers." }
			: {
					prior: {
						type,
						mu: canonicalMu,
						sigma: canonicalSigma,
					},
					error: null,
				};
	}

	if (type === "Uniform") {
		const lower = parseFiniteNumber(draft.lower ?? "");
		const upper = parseFiniteNumber(draft.upper ?? "");
		const canonicalLower =
			lower === null ? null : fromDisplayNumber(paramName, lower, display);
		const canonicalUpper =
			upper === null ? null : fromDisplayNumber(paramName, upper, display);
		return lower === null ||
			upper === null ||
			canonicalLower === null ||
			canonicalUpper === null
			? { error: "Uniform lower and upper must be finite numbers." }
			: {
					prior: {
						type,
						lower: canonicalLower,
						upper: canonicalUpper,
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

		const canonicalMu = fromDisplayNumber(paramName, mu, display);
		const canonicalSigma = fromDisplaySpreadNumber(paramName, sigma, display);
		const canonicalLower =
			lower === undefined
				? undefined
				: fromDisplayNumber(paramName, lower, display);
		const canonicalUpper =
			upper === undefined
				? undefined
				: fromDisplayNumber(paramName, upper, display);

		if (
			canonicalMu === null ||
			canonicalSigma === null ||
			canonicalLower === null ||
			canonicalUpper === null
		) {
			return {
				error: "Truncated normal values must be finite in the selected unit.",
			};
		}

		return {
			prior: {
				type,
				mu: canonicalMu,
				sigma: canonicalSigma,
				lower: canonicalLower,
				upper: canonicalUpper,
			},
			error: null,
		};
	}

	const value = parseFiniteNumber(draft.value ?? "");
	const [refModelIdText, refParam] = (draft.reference ?? "").split(":");
	const refModelId = Number.parseInt(refModelIdText ?? "", 10);
	const mode = draft.mode === "multiply" ? "multiply" : "add";
	const canonicalValue =
		value === null
			? null
			: mode === "add"
				? fromDisplaySpreadNumber(paramName, value, display)
				: value;

	if (
		value === null ||
		canonicalValue === null ||
		!Number.isFinite(refModelId) ||
		!refParam
	) {
		return {
			error:
				"Deterministic prior needs a finite value and reference parameter.",
		};
	}

	return {
		prior: {
			type,
			mode,
			value: canonicalValue,
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

function isGaussianFitModel(
	model: Spectrum1DCanvasFitModel,
): model is Spectrum1DCanvasGaussianFitModel {
	return model.kind === "gaussian";
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
	const [useVelocityForSigma, setUseVelocityForSigma] = useState(true);
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
	const activeGaussianModels = useMemo(
		() => activeModels.filter(isGaussianFitModel),
		[activeModels],
	);
	const autoFwhmPriorResult = useMemo(
		() =>
			createTwoGaussianFwhmAutoPriors(activeGaussianModels, {
				priorSigmaFwhmKmS: AUTO_FWHM_PRIOR_SIGMA_KM_S,
			}),
		[activeGaussianModels],
	);
	const selectedModel =
		selectedModelId === null
			? null
			: (activeModels.find((model) => model.id === selectedModelId) ?? null);
	const canUseVelocity =
		selectedModel?.kind === "gaussian" &&
		selectedParamName === "sigma" &&
		Number.isFinite(selectedModel.muUm) &&
		selectedModel.muUm > 0;
	const sigmaVelocityMuUm =
		canUseVelocity && selectedModel?.kind === "gaussian"
			? selectedModel.muUm
			: null;
	const displayContext = useMemo(
		() => ({
			...display,
			useVelocityForSigma: canUseVelocity && useVelocityForSigma,
			sigmaVelocityMuUm,
		}),
		[canUseVelocity, display, sigmaVelocityMuUm, useVelocityForSigma],
	);
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
				display: displayContext,
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
			displayContext,
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
			const nextCanUseVelocity =
				selectedModel.kind === "gaussian" &&
				paramName === "sigma" &&
				Number.isFinite(selectedModel.muUm) &&
				selectedModel.muUm > 0;
			const nextDisplayContext = {
				...display,
				useVelocityForSigma: nextCanUseVelocity && useVelocityForSigma,
				sigmaVelocityMuUm:
					nextCanUseVelocity && selectedModel.kind === "gaussian"
						? selectedModel.muUm
						: null,
			};
			setSelectedParamName(paramName);
			setDraft(
				createDraftFromPrior({
					prior,
					paramName,
					display: nextDisplayContext,
				}),
			);
			setValidationError(null);
		},
		[configuration, display, selectedModel, useVelocityForSigma],
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
				display: displayContext,
			});
			setDraft(nextDraft);
			commitDraft({ target: editingTarget, type, nextDraft });
		},
		[
			commitDraft,
			displayContext,
			editingTarget,
			referenceOptions,
			selectedModel,
		],
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

	const handleApplyAutoFwhmPriors = useCallback(() => {
		if (
			sourceId === null ||
			configurationId === null ||
			autoFwhmPriorResult.reason !== null
		) {
			return;
		}

		for (const assignment of autoFwhmPriorResult.assignments) {
			setFitModelPrior(
				sourceId,
				configurationId,
				assignment.modelId,
				assignment.paramName,
				assignment.prior,
			);
		}

		const editingAssignment =
			editingTarget?.paramName === "sigma"
				? autoFwhmPriorResult.assignments.find(
						(assignment) => assignment.modelId === editingTarget.modelId,
					)
				: undefined;
		if (editingAssignment) {
			setDraft(
				createDraftFromPrior({
					prior: editingAssignment.prior,
					paramName: editingAssignment.paramName,
					display: displayContext,
				}),
			);
			setValidationError(null);
		}
	}, [
		autoFwhmPriorResult,
		configurationId,
		displayContext,
		editingTarget,
		setFitModelPrior,
		sourceId,
	]);

	const handleUseVelocityChange = useCallback(
		(nextUseVelocity: boolean) => {
			setUseVelocityForSigma(nextUseVelocity);

			if (!selectedModel || selectedParamName === null) {
				return;
			}

			const nextCanUseVelocity =
				selectedModel.kind === "gaussian" &&
				selectedParamName === "sigma" &&
				Number.isFinite(selectedModel.muUm) &&
				selectedModel.muUm > 0;
			const nextDisplayContext = {
				...display,
				useVelocityForSigma: nextCanUseVelocity && nextUseVelocity,
				sigmaVelocityMuUm:
					nextCanUseVelocity && selectedModel.kind === "gaussian"
						? selectedModel.muUm
						: null,
			};

			setDraft(
				createDraftFromPrior({
					prior: currentPrior,
					paramName: selectedParamName,
					display: nextDisplayContext,
				}),
			);
			setValidationError(null);
		},
		[currentPrior, display, selectedModel, selectedParamName],
	);

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
								: toDisplayNumber(paramName, canonicalValue, displayContext);

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
		[
			configuration,
			displayContext,
			selectParameter,
			selectedModel,
			selectedParamName,
		],
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
							displayContext,
						),
						5,
					),
					unitLabel: getDisplayUnitLabel(
						editingTarget.paramName,
						displayContext,
					),
					type: currentType,
					draft,
					referenceOptions,
					canUseVelocity,
					useVelocity: displayContext.useVelocityForSigma,
					validationError,
					onTypeChange: handleTypeChange,
					onDraftChange: handleDraftChange,
					onUseVelocityChange: handleUseVelocityChange,
				}
			: null;

	const canClearActivePriors = activeModels.some((model) =>
		Object.keys(configuration?.priorsByModelId?.[model.id] ?? {}).some(
			(paramName) => getLineFitPriorParameters(model).includes(paramName),
		),
	);
	const autoFwhmPriors = {
		canApply: autoFwhmPriorResult.reason === null,
		tooltip:
			autoFwhmPriorResult.reason ??
			"Generate truncated-normal FWHM priors for two active gaussians.",
		onApply: handleApplyAutoFwhmPriors,
	};

	return {
		isOpen: configurationId !== null,
		configurationName: configuration?.name ?? "",
		models: modelOptions,
		parameters: parameterOptions,
		editor,
		autoFwhmPriors,
		canClearActivePriors,
		open,
		close,
		onOpenChange,
		onClearActivePriors,
	};
}
