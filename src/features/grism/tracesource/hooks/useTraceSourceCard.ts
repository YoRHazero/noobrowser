import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { toaster } from "@/components/ui/toaster";
import { useExtractSpectrum, useSourcePosition } from "@/hook/connection-hook";
import type { TraceSource } from "@/stores/stores-types";
import type { GlobalSettings, UpdateSource } from "../types";
import { extractSpectrumQueryKey } from "../utils";

export function useTraceSourceCard(args: {
	source: TraceSource;
	isMain: boolean;
	settings: GlobalSettings;
	isValidSettings: boolean;
	onSetMain: (id: string) => void;
	onRemove: (id: string) => void;
	onUpdateSource: UpdateSource;
}) {
	const {
		source,
		isMain,
		settings,
		isValidSettings,
		onSetMain,
		onRemove,
		onUpdateSource,
	} = args;

	const queryClient = useQueryClient();

	const [useDMS, setUseDMS] = useState(false);
	const [isSpectrumActive, setIsSpectrumActive] = useState(false);

	const shouldFetchCoords = source.ra === undefined || source.ra === null;

	const sourcePositionQuery = useSourcePosition({
		x: source.x,
		y: source.y,
		enabled: shouldFetchCoords,
	});

	const spectrumQuery = useExtractSpectrum({
		selectedFootprintId: source.groupId,
		x: Math.round(source.x),
		y: Math.round(source.y),
		apertureSize: settings.apertureSize,
		waveMin: settings.waveMin,
		waveMax: settings.waveMax,
		enabled: isSpectrumActive && isValidSettings,
	});

	// --- Effect: World Coordinates 返回 ---
	useEffect(() => {
		if (sourcePositionQuery.data) {
			queueMicrotask(() => {
				onUpdateSource(source.id, {
					ra: sourcePositionQuery.data.ra,
					dec: sourcePositionQuery.data.dec,
					raHms: sourcePositionQuery.data.ra_hms,
					decDms: sourcePositionQuery.data.dec_dms,
				});
			});
		}
	}, [sourcePositionQuery.data, source.id, onUpdateSource]);

	// --- Effect: Spectrum 返回 ---
	useEffect(() => {
		if (spectrumQuery.isSuccess && spectrumQuery.data) {
			const isCovered = spectrumQuery.data.covered;

			queueMicrotask(() => {
				if (source.spectrumReady !== isCovered) {
					onUpdateSource(source.id, { spectrumReady: isCovered });
				}

				if (isCovered) {
					toaster.create({
						title: "Spectrum Extracted",
						description: `Source ${source.id.slice(0, 4)} is covered.`,
						type: "success",
					});
				} else {
					toaster.create({
						title: "Not Covered",
						description: `Source ${source.id.slice(0, 4)} has no spectrum data.`,
						type: "warning",
					});
				}
			});
		} else if (spectrumQuery.isError) {
			queueMicrotask(() => {
				onUpdateSource(source.id, { spectrumReady: false });
				setIsSpectrumActive(false);
				toaster.create({
					title: "Fetch Failed",
					description: (spectrumQuery.error as Error).message,
					type: "error",
				});
			});
		}
	}, [
		spectrumQuery.isSuccess,
		spectrumQuery.isError,
		spectrumQuery.data,
		spectrumQuery.error,
		source.id,
		source.spectrumReady,
		onUpdateSource,
	]);

	const onClickCard = () => onSetMain(source.id);

	const onDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onRemove(source.id);
	};

	const onToggleWorldFormat = (e: React.MouseEvent) => {
		e.stopPropagation();
		setUseDMS(!useDMS);
	};

	const onSpectrumToggle = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isSpectrumActive || source.spectrumReady) {
			setIsSpectrumActive(false);
			onUpdateSource(source.id, { spectrumReady: false });

			const queryKey = extractSpectrumQueryKey(source, settings);
			queryClient.removeQueries({ queryKey });

			queueMicrotask(() => {
				toaster.create({
					description: "Spectrum cache cleared.",
					type: "info",
				});
			});
		} else {
			setIsSpectrumActive(true);
		}
	};

	const worldText = useMemo(() => {
		if (source.ra && source.dec) {
			return useDMS
				? `${source.raHms ?? "-"}, ${source.decDms ?? "-"}`
				: `${source.ra.toFixed(5)}, ${source.dec.toFixed(5)}`;
		}
		return "Loading Coords...";
	}, [source.ra, source.dec, source.raHms, source.decDms, useDMS]);

	const worldTooltip = useDMS
		? "Click to Switch to Degrees"
		: "Click to Switch to DMS";

	const spectrumTooltip =
		isSpectrumActive || source.spectrumReady
			? "Clear Spectrum Cache"
			: isValidSettings
				? "Fetch Spectrum"
				: "Invalid Settings";

	const spectrumDisabled =
		!isSpectrumActive && !source.spectrumReady && !isValidSettings;

	return {
		// identity
		source,
		isMain,
		settings,

		// display
		useDMS,
		worldText,
		worldTooltip,
		spectrumTooltip,

		// state
		isSpectrumActive,
		isSpectrumLoading: isSpectrumActive && spectrumQuery.isLoading,
		spectrumDisabled,

		// handlers
		onClickCard,
		onDelete,
		onToggleWorldFormat,
		onSpectrumToggle,
	};
}
