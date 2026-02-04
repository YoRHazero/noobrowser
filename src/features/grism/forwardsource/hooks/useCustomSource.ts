import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useExtractSpectrum } from "@/hooks/query/source/useExtractSpectrum";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";

export function useCustomSource() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const {
		apertureSize,
		forwardWaveRange,
		globalSpectrumQueryKey, // renamed to avoid conflict
		setSpectrumQueryKey,
		setApertureSize,
		setForwardWaveRange,
	} = useGrismStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			forwardWaveRange: state.forwardWaveRange,
			globalSpectrumQueryKey: state.spectrumQueryKey,
			setSpectrumQueryKey: state.setSpectrumQueryKey,
			setApertureSize: state.setApertureSize,
			setForwardWaveRange: state.setForwardWaveRange,
		})),
	);

	const { setDisplayedTraceSource } = useSourcesStore(
		useShallow((state) => ({
			setDisplayedTraceSource: state.setDisplayedTraceSource,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [enabled, setEnabled] = useState(false);
	const [ra, setRa] = useState<number | undefined>(undefined);
	const [dec, setDec] = useState<number | undefined>(undefined);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const isReady =
		typeof ra === "number" &&
		typeof dec === "number" &&
		apertureSize > 1 &&
		forwardWaveRange.max > forwardWaveRange.min;

	const queryKey = [
		"extract_spectrum",
		`custom-${ra}-${dec}`,
		forwardWaveRange.min,
		forwardWaveRange.max,
		apertureSize,
		ra?.toFixed(10),
		dec?.toFixed(10),
	];

	// Check if the current global query key matches our local key
	// We use JSON.stringify for a simple deep comparison of the array
	const isDisplayed =
		globalSpectrumQueryKey !== null &&
		JSON.stringify(globalSpectrumQueryKey) === JSON.stringify(queryKey);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	// Only pass RA/Dec to the hook if BOTH are present to avoid validation error
	const safeRa = ra !== undefined && dec !== undefined ? ra : undefined;
	const safeDec = ra !== undefined && dec !== undefined ? dec : undefined;

	const queryClient = useQueryClient();
	const {
		isFetching,
		isError,
		isSuccess,
		data,
		refetch,
	} = useExtractSpectrum({
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
		apertureSize,
		ra: safeRa,
		dec: safeDec,
		enabled: false, // passive
		queryKey,
	});

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleExtract = async () => {
		if (!isReady) {
			toaster.error({
				title: "Invalid Settings",
				description: "Please check RA/Dec inputs and extraction settings.",
			});
			return;
		}

		// Set displayed trace source to null to indicate custom source
		setDisplayedTraceSource(null);

		// Set the spectrum query key in the global store so consumers (spectrum1d/2d) can pick it up
		setSpectrumQueryKey(queryKey);

		// Also cancel any ongoing queries for this specific custom source to ensure fresh data
		await queryClient.cancelQueries({ queryKey });

		// Trigger the fetch
		refetch();
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		enabled,
		setEnabled,
		ra,
		setRa,
		dec,
		setDec,
		apertureSize,
		setApertureSize,
		forwardWaveRange,
		setForwardWaveRange,
		isReady,
		isFetching,
		isError,
		isSuccess,
		data,
		isDisplayed,
		handleExtract,
	};
}
