"use client";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
// Hooks
import { useSubmitFitJobMutation } from "@/hook/connection-hook";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
// Stores
import { useSourcesStore } from "@/stores/sources";

// Types
import type { TraceSource } from "@/stores/stores-types";

export function useConfigurationSubmitController() {
	// --- 1. Local UI State ---
	const [apertureSize, setApertureSize] = useState(5);
	const [extractMode, setExtractMode] = useState<string[]>(["GRISMR"]);

	// --- 2. Store Access ---
	const { traceSources, displayedTraceSourceId, setDisplayedTraceSource } =
		useSourcesStore(
			useShallow((s) => ({
				traceSources: s.traceSources,
				displayedTraceSourceId: s.displayedTraceSourceId,
				setDisplayedTraceSource: s.setDisplayedTraceSource,
			})),
		);
	const readySources = traceSources.filter((s) => s.spectrumReady);

	const setForwardSourcePosition = useGrismStore(
		(s) => s.setForwardSourcePosition,
	);
	const getSelectedConfiguration = useFitStore(
		(s) => s.getSelectedConfiguration,
	);

	// --- 3. Mutation ---
	const { mutate: submitJob, isPending: isGlobalSubmitting } =
		useSubmitFitJobMutation();

	// --- 4. Actions / Handlers ---
	const handleSelectSource = (source: TraceSource) => {
		setDisplayedTraceSource(source.id);
		setForwardSourcePosition({
			x: Math.round(source.x),
			y: Math.round(source.y),
		});
	};

	const handleRunFit = (sourceId: string) => {
		// Pre-flight Check
		const selectedConfigs = getSelectedConfiguration();

		if (selectedConfigs.length === 0) {
			toaster.create({
				title: "Configuration Missing",
				description: "Please select at least one Fit Configuration to run.",
				type: "warning",
			});
			return;
		}

		// Execute Mutation
		submitJob({
			sourceId,
			extractionConfig: {
				aperture_size: apertureSize,
				extraction_mode: extractMode[0] as "GRISMR" | "GRISMC",
			},
		});
	};

	// --- 5. Return Interface ---
	return {
		// Data
		readySources,
		displayedTraceSourceId,

		// Parameter Controls
		extractionParams: {
			apertureSize,
			setApertureSize,
			extractMode,
			setExtractMode,
		},

		// Status
		isGlobalSubmitting,
		hasSelectedConfig: getSelectedConfiguration().length > 0,

		// Actions
		handleSelectSource,
		handleRunFit,
	};
}
