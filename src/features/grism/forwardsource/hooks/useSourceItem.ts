import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useSubmitFitJobMutation } from "@/hooks/query/fit/useSubmitFitJob";
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

	const { configurations, fitExtraction, jobs } = useFitStore(
		useShallow((state) => ({
			configurations: state.configurations,
			fitExtraction: state.fitExtraction,
			jobs: state.jobs,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const isSelected = displayedTraceSourceId === source.id;
	const hasSelectedConfig = configurations.some((config) => config.selected);
	const canRun = hasSelectedConfig;

	const activeJob = useMemo(
		() =>
			jobs.find(
				(job) =>
					job.job_id === source.id &&
					(job.status === "pending" || job.status === "processing"),
			),
		[jobs, source.id],
	);
	const isRunning = Boolean(activeJob);
	const runVariant: "surface" | "ghost" =
		canRun && !isRunning ? "surface" : "ghost";
	const runPalette: "cyan" | "gray" = canRun && !isRunning ? "cyan" : "gray";
	const tooltipContent = activeJob
		? `Job Running (${activeJob.status})`
		: canRun
			? "Run MCMC Analysis"
			: "Select a Config first";

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const { mutate: submitJob } = useSubmitFitJobMutation();

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

	const handleRun = () => {
		if (!hasSelectedConfig) {
			toaster.create({
				title: "Configuration Missing",
				description: "Please select at least one Fit Configuration to run.",
				type: "warning",
			});
			return;
		}

		submitJob({
			sourceId: source.id,
			extractionConfig: {
				aperture_size: fitExtraction.apertureSize,
				extraction_mode: fitExtraction.extractMode,
			},
		});
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		isSelected,
		canRun,
		activeJob,
		isRunning,
		runVariant,
		runPalette,
		tooltipContent,
		handleSelect,
		handleRun,
	};
}
