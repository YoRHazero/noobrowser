import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useSubmitFitJob } from "@/hooks/query/fit/useSubmitFitJob";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import type { TraceSource } from "@/stores/stores-types";

export function useSourceItem(source: TraceSource) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { displayedTraceSourceId, setDisplayedTraceSource } = useSourcesStore(
		useShallow((state) => ({
			displayedTraceSourceId: state.displayedTraceSourceId,
			setDisplayedTraceSource: state.setDisplayedTraceSource,
		})),
	);

	const {
		apertureSize,
		forwardWaveRange,
		setForwardSourcePosition,
		setSpectrumQueryKey,
	} = useGrismStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			forwardWaveRange: state.forwardWaveRange,
			setForwardSourcePosition: state.setForwardSourcePosition,
			setSpectrumQueryKey: state.setSpectrumQueryKey,
		})),
	);

	const { configurations, fitExtraction } = useFitStore(
		useShallow((state) => ({
			configurations: state.configurations,
			fitExtraction: state.fitExtraction,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const submitJob = useSubmitFitJob();
	const cooldownMs = 5000;

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const isSelected = displayedTraceSourceId === source.id;
	const hasSelectedConfig = configurations.some((config) => config.selected);
	const canRun = hasSelectedConfig;
	const isCooldownActive = cooldownUntil !== null && cooldownUntil > Date.now();
	const isSubmitting = submitJob.isPending;
	const isRunning = isSubmitting || isCooldownActive;
	const runVariant: "surface" | "ghost" =
		canRun && !isRunning ? "surface" : "ghost";
	const runPalette: "cyan" | "gray" = canRun && !isRunning ? "cyan" : "gray";
	const tooltipContent = isSubmitting
		? "Submitting job..."
		: isCooldownActive
			? "Please wait 5 seconds before submitting again."
			: canRun
				? "Run MCMC Analysis"
				: "Select a Config first";

	useEffect(() => {
		if (!cooldownUntil) return undefined;
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

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleSelect = () => {
		const spectrumQueryKey = [
			"extract_spectrum",
			source.id,
			forwardWaveRange.min,
			forwardWaveRange.max,
			apertureSize,
			source.ra?.toFixed(10),
			source.dec?.toFixed(10),
		];
		setDisplayedTraceSource(source.id);
		setSpectrumQueryKey(spectrumQueryKey);
		setForwardSourcePosition({
			x: Math.round(source.x),
			y: Math.round(source.y),
		});
	};

	const handleRun = async () => {
		if (!hasSelectedConfig) {
			toaster.create({
				title: "Configuration Missing",
				description: "Please select at least one Fit Configuration to run.",
				type: "warning",
			});
			return;
		}
		if (isSubmitting || isCooldownActive) return;

		setCooldownUntil(Date.now() + cooldownMs);

		const selectedConfigs = configurations.filter((c) => c.selected);
		const fitConfigs = selectedConfigs.map((c) => ({
			model_name: c.name,
			models: c.models,
		}));

		try {
			const response = await submitJob.mutateAsync({
				body: {
					extraction: {
						extraction_config: {
							aperture_size: fitExtraction.apertureSize,
							offset: fitExtraction.offset,
							extract_mode: fitExtraction.extractMode,
						},
						source_meta: {
							source_id: source.id,
							ra: source.ra,
							dec: source.dec,
							x: source.x,
							y: source.y,
							z: source.z,
							group_id: source.groupId ? Number(source.groupId) : null,
						},
					},
					fit: fitConfigs,
				},
			});
			toaster.success({
				title: "Fit Job Submitted",
				description: `Job ID: ${response.job_id.slice(0, 8)}`,
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			toaster.error({
				title: "Fit Job Submission Failed",
				description: message,
			});
		}
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		isSelected,
		canRun,
		isRunning,
		runVariant,
		runPalette,
		tooltipContent,
		handleSelect,
		handleRun,
	};
}
