"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { useSubmitFitJob } from "@/hooks/query/fit";
import type { Source } from "@/stores/source";
import type { SpectrumWorkspaceFitConfiguration } from "../store";
import { createLineFitJobBody, createLineFitJobConfigurations } from "../utils";
import type {
	FitJobActionBarModel,
	FitJobExtractMode,
} from "./lineFitModels";

const DEFAULT_JOB_OFFSET = 0;
const DEFAULT_JOB_APERTURE_SIZE = 5;
const DEFAULT_JOB_EXTRACT_MODE: FitJobExtractMode = "GRISMR";

function formatApiErrorDetail(detail: unknown): string | null {
	if (Array.isArray(detail)) {
		const messages = detail
			.map((item) => {
				if (typeof item === "string") {
					return item;
				}

				if (item && typeof item === "object") {
					const record = item as { loc?: unknown; msg?: unknown };
					const location = Array.isArray(record.loc)
						? record.loc.join(".")
						: null;
					const message =
						typeof record.msg === "string" ? record.msg : JSON.stringify(item);

					return location ? `${location}: ${message}` : message;
				}

				return String(item);
			})
			.filter((message) => message.length > 0);

		return messages.length > 0 ? messages.join("\n") : null;
	}

	if (typeof detail === "string") {
		return detail;
	}

	if (detail && typeof detail === "object") {
		return JSON.stringify(detail);
	}

	return null;
}

function toMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const responseData = error.response?.data;
		if (responseData && typeof responseData === "object") {
			const detail = formatApiErrorDetail(
				(responseData as { detail?: unknown }).detail,
			);
			if (detail) {
				return detail;
			}
		}
	}

	return error instanceof Error ? error.message : String(error);
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
	return count === 1 ? singular : plural;
}

function parseFiniteNumber(value: string): number | null {
	const trimmedValue = value.trim();
	if (trimmedValue.length === 0) {
		return null;
	}

	const parsedValue = Number(trimmedValue);
	return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatJobNumber(value: number, fractionDigits = 3): string {
	if (!Number.isFinite(value)) {
		return "-";
	}

	return Number(value.toFixed(fractionDigits)).toString();
}

function formatOffsetDraft(value: number | null | undefined): string {
	return formatJobNumber(value ?? DEFAULT_JOB_OFFSET, 3);
}

function formatApertureDraft(value: number | null | undefined): string {
	return formatJobNumber(value ?? DEFAULT_JOB_APERTURE_SIZE, 3);
}

export function useLineFitMcmcSubmission({
	source,
	configurations,
	selectedConfigurationIds,
}: {
	source: Source | null;
	configurations: readonly SpectrumWorkspaceFitConfiguration[];
	selectedConfigurationIds: readonly string[];
}): FitJobActionBarModel {
	const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
	const [offsetDraft, setOffsetDraft] = useState(() =>
		formatOffsetDraft(DEFAULT_JOB_OFFSET),
	);
	const [apertureSizeDraft, setApertureSizeDraft] = useState(() =>
		formatApertureDraft(DEFAULT_JOB_APERTURE_SIZE),
	);
	const [extractMode, setExtractMode] = useState<FitJobExtractMode>(
		DEFAULT_JOB_EXTRACT_MODE,
	);
	const submitFitJob = useSubmitFitJob();
	const sourceId = source?.id ?? null;
	const offsetValue = parseFiniteNumber(offsetDraft);
	const apertureSizeValue = parseFiniteNumber(apertureSizeDraft);
	const offsetInvalid = offsetValue === null;
	const apertureSizeInvalid =
		apertureSizeValue === null || apertureSizeValue <= 0;
	const hasInvalidJobSettings = offsetInvalid || apertureSizeInvalid;
	const selectedConfigurationIdSet = useMemo(
		() => new Set(selectedConfigurationIds),
		[selectedConfigurationIds],
	);
	const selectedConfigurations = useMemo(
		() =>
			configurations.filter((configuration) =>
				selectedConfigurationIdSet.has(configuration.id),
			),
		[configurations, selectedConfigurationIdSet],
	);
	const selectedConfigurationCount = selectedConfigurations.length;
	const activeModelCount = useMemo(
		() =>
			selectedConfigurations.reduce(
				(count, configuration) =>
					count + configuration.models.filter((model) => model.active).length,
				0,
			),
		[selectedConfigurations],
	);
	const hasConfigurationWithoutActiveModels = selectedConfigurations.some(
		(configuration) => !configuration.models.some((model) => model.active),
	);
	const fitConfigurations = useMemo(
		() =>
			createLineFitJobConfigurations(configurations, selectedConfigurationIds),
		[configurations, selectedConfigurationIds],
	);
	const body = useMemo(
		() =>
			source === null || offsetValue === null || apertureSizeValue === null
				? null
				: createLineFitJobBody({
						source,
						fit: fitConfigurations,
						jobSettings: {
							apertureSize: apertureSizeValue,
							offset: offsetValue,
							extractMode,
						},
					}),
		[apertureSizeValue, extractMode, fitConfigurations, offsetValue, source],
	);
	const isCooldownActive = cooldownUntil !== null && cooldownUntil > Date.now();
	const isSubmitting = submitFitJob.isPending;

	useEffect(() => {
		if (!source) {
			setOffsetDraft(formatOffsetDraft(DEFAULT_JOB_OFFSET));
			setApertureSizeDraft(formatApertureDraft(DEFAULT_JOB_APERTURE_SIZE));
			setExtractMode(DEFAULT_JOB_EXTRACT_MODE);
			return;
		}

		setOffsetDraft(formatOffsetDraft(DEFAULT_JOB_OFFSET));
		setApertureSizeDraft(formatApertureDraft(DEFAULT_JOB_APERTURE_SIZE));
		setExtractMode(DEFAULT_JOB_EXTRACT_MODE);
	}, [sourceId]);

	useEffect(() => {
		if (!cooldownUntil) {
			return undefined;
		}

		const remainingMs = cooldownUntil - Date.now();
		if (remainingMs <= 0) {
			setCooldownUntil(null);
			return undefined;
		}

		const timeoutId = setTimeout(() => {
			setCooldownUntil(null);
		}, remainingMs);

		return () => clearTimeout(timeoutId);
	}, [cooldownUntil]);

	const disabledReason =
		source === null
			? "Select a source before submitting MCMC."
			: selectedConfigurationCount === 0
				? "Select at least one configuration for MCMC."
				: source.spectrum.status !== "ready"
					? "Spectrum extraction is not ready."
					: hasConfigurationWithoutActiveModels
						? "Every selected configuration needs at least one active model."
						: hasInvalidJobSettings
							? "MCMC job settings are invalid."
							: body === null
								? "MCMC payload is incomplete."
								: isSubmitting
									? "Submitting fit job..."
									: isCooldownActive
										? "Please wait before submitting another fit job."
										: null;
	const canSubmit = disabledReason === null;

	const handleSubmit = useCallback(async () => {
		if (!canSubmit || body === null) {
			if (disabledReason) {
				toaster.create({
					title: "Cannot submit MCMC",
					description: disabledReason,
					type: "warning",
				});
			}
			return;
		}

		setCooldownUntil(Date.now() + 5000);

		try {
			const response = await submitFitJob.mutateAsync({ body });
			toaster.success({
				title: "Fit job submitted",
				description: `Job ID: ${response.job_id.slice(0, 8)}`,
			});
		} catch (error) {
			toaster.error({
				title: "Fit job submission failed",
				description: toMessage(error),
			});
		}
	}, [body, canSubmit, disabledReason, submitFitJob]);

	const statusLabel =
		selectedConfigurationCount === 0
			? "No MCMC configurations"
			: `${selectedConfigurationCount} ${pluralize(
					selectedConfigurationCount,
					"configuration",
				)}`;
	const detailLabel =
		selectedConfigurationCount === 0
			? "Use configuration switches to include models"
			: `${activeModelCount} active ${pluralize(activeModelCount, "model")}`;

	return {
		selectedConfigurationCount,
		activeModelCount,
		statusLabel,
		detailLabel,
		canSubmit,
		isSubmitting,
		tooltip: disabledReason ?? "Submit selected configurations as an MCMC job.",
		onSubmit: handleSubmit,
		jobSettings: {
			offsetValue: offsetDraft,
			apertureSizeValue: apertureSizeDraft,
			extractMode,
			offsetInvalid,
			apertureSizeInvalid,
			onOffsetChange: setOffsetDraft,
			onOffsetBlur: () => {
				if (offsetValue === null) {
					return;
				}

				setOffsetDraft(formatOffsetDraft(offsetValue));
			},
			onApertureSizeChange: setApertureSizeDraft,
			onApertureSizeBlur: () => {
				if (apertureSizeValue === null || apertureSizeValue <= 0) {
					return;
				}

				setApertureSizeDraft(formatApertureDraft(apertureSizeValue));
			},
			onExtractModeChange: setExtractMode,
			onReset: () => {
				setOffsetDraft(formatOffsetDraft(DEFAULT_JOB_OFFSET));
				setApertureSizeDraft(formatApertureDraft(DEFAULT_JOB_APERTURE_SIZE));
				setExtractMode(DEFAULT_JOB_EXTRACT_MODE);
			},
		},
	};
}
