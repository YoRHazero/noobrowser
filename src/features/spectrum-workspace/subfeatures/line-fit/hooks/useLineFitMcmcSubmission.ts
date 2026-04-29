"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useSubmitFitJob } from "@/hooks/query/fit";
import type { Source } from "@/stores/source";
import type { SpectrumWorkspaceFitConfiguration } from "../store";
import { createLineFitJobBody, createLineFitJobConfigurations } from "../utils";
import type { FitJobActionBarModel } from "./lineFitModels";

function toMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
	return count === 1 ? singular : plural;
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
	const submitFitJob = useSubmitFitJob();
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
			source === null
				? null
				: createLineFitJobBody({
						source,
						fit: fitConfigurations,
					}),
		[fitConfigurations, source],
	);
	const isCooldownActive = cooldownUntil !== null && cooldownUntil > Date.now();
	const isSubmitting = submitFitJob.isPending;

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
					: source.spectrum.extractionParams === null
						? "Spectrum extraction settings are incomplete."
						: hasConfigurationWithoutActiveModels
							? "Every selected configuration needs at least one active model."
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
	};
}
