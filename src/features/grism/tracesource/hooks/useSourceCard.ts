import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useSource } from "@/hooks/query/source";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import type { TraceSource } from "@/stores/stores-types";

export function useSourceCard(source: TraceSource) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { apertureSize, forwardWaveRange } = useGrismStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			forwardWaveRange: state.forwardWaveRange,
		})),
	);
	const {
		mainTraceSourceId,
		updateTraceSource,
		setMainTraceSource,
		removeTraceSource,
	} = useSourcesStore(
		useShallow((state) => ({
			mainTraceSourceId: state.mainTraceSourceId,
			updateTraceSource: state.updateTraceSource,
			setMainTraceSource: state.setMainTraceSource,
			removeTraceSource: state.removeTraceSource,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [useDms, setUseDms] = useState<boolean>(false);

	const isMain = source.id === mainTraceSourceId;

	const isSettingsValid =
		apertureSize > 1 && forwardWaveRange.max > forwardWaveRange.min;

	const sourceHasRaDec =
		typeof source.ra === "number" && typeof source.dec === "number";
	const canFetchSpec = isSettingsValid && sourceHasRaDec;
	/* -------------------------------------------------------------------------- */
	/*                               Access Tanstack                              */
	/* -------------------------------------------------------------------------- */
	const queryClient = useQueryClient();
	const { positionQuery, spectrumQuery } = useSource({
		source,
		posEnabled: !sourceHasRaDec,
		specEnabled: false,
	});
	/* -------------------------------------------------------------------------- */
	/*                                   Effect                                   */
	/* -------------------------------------------------------------------------- */

	// --- Effect: World coordinate returned from positionQuery ---
	useEffect(() => {
		if (positionQuery.data) {
			queueMicrotask(() => {
				updateTraceSource(source.id, {
					ra: positionQuery.data.ra,
					dec: positionQuery.data.dec,
					raHms: positionQuery.data.ra_hms,
					decDms: positionQuery.data.dec_dms,
				});
			});
		}
	}, [positionQuery.data, source.id, updateTraceSource]);
	// Spectrum Extraction Effect will be triggered in poller due to SourceCard will not always be mounted

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const fetchSpectrum = () => {
		if (!isSettingsValid) {
			toaster.error({
				title: "Invalid Settings",
				description: "Please ensure aperture size > 1 and waveMax > waveMin.",
			});
			return;
		}
		spectrumQuery.refetch();
	};

	const toggleFormat = () => {
		setUseDms((prev) => !prev);
	};

	const setAsMainSource = () => {
		isMain ? setMainTraceSource(null) : setMainTraceSource(source.id);
	};

	const deleteSpectrum = () => {
		queryClient.cancelQueries({
			queryKey: ["extract_spectrum", source.id],
			exact: false,
		});
		queryClient.removeQueries({
			queryKey: ["extract_spectrum", source.id],
			exact: false,
		});
		updateTraceSource(source.id, {
			spectrumReady: false,
		});
		toaster.success({
			title: "Spectrum Deleted",
			description: `Spectrum for source ${source.id.slice(0, 8)} has been deleted.`,
		});
	};

	const removeSource = () => {
		removeTraceSource(source.id);
	};
	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		// state
		isMain,

		// world coordinate format
		useDms,
		toggleFormat,

		// queries
		positionQuery,
		spectrumQuery,

		// settings validity
		isSettingsValid,
		sourceHasRaDec,
		canFetchSpec,

		// handlers
		fetchSpectrum,
		setAsMainSource,
		deleteSpectrum,
		removeSource,
	};
}
