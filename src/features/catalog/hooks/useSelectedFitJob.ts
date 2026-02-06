import { useEffect, useMemo } from "react";
import { useCatalogStore } from "../store/catalog-store";
import {
	getLatestFitJobId,
	sortFitHistoryByCreatedAt,
} from "../utils/fit-history";

export function useSelectedFitJob() {
	const selectedSource = useCatalogStore((state) => state.selectedSource);
	const selectedFitJobId = useCatalogStore((state) => state.selectedFitJobId);
	const setSelectedFitJobId = useCatalogStore(
		(state) => state.setSelectedFitJobId,
	);
	const selectedPlotModelName = useCatalogStore(
		(state) => state.selectedPlotModelName,
	);
	const setSelectedPlotModelName = useCatalogStore(
		(state) => state.setSelectedPlotModelName,
	);
	const subtractModelList = useCatalogStore(
		(state) => state.subtractModelList,
	);
	const setSubtractModelList = useCatalogStore(
		(state) => state.setSubtractModelList,
	);

	const fitHistory = useMemo(() => {
		if (!selectedSource?.fit_history) return [];
		return sortFitHistoryByCreatedAt(selectedSource.fit_history);
	}, [selectedSource]);

	const selectedFitEntry = useMemo(() => {
		if (!selectedFitJobId) return null;
		return fitHistory.find((entry) => entry.job_id === selectedFitJobId) ?? null;
	}, [fitHistory, selectedFitJobId]);

	useEffect(() => {
		if (!selectedSource) {
			if (selectedFitJobId !== null) {
				setSelectedFitJobId(null);
			}
			return;
		}

		if (fitHistory.length === 0) {
			if (selectedFitJobId !== null) {
				setSelectedFitJobId(null);
			}
			return;
		}

		const existing = fitHistory.find(
			(entry) => entry.job_id === selectedFitJobId,
		);
		if (existing) return;

		const latestId = getLatestFitJobId(fitHistory);
		if (latestId && latestId !== selectedFitJobId) {
			setSelectedFitJobId(latestId);
		}
	}, [fitHistory, selectedFitJobId, selectedSource, setSelectedFitJobId]);

	useEffect(() => {
		if (!selectedFitEntry) {
			if (selectedPlotModelName !== null) {
				setSelectedPlotModelName(null);
			}
			if (subtractModelList !== null) {
				setSubtractModelList(null);
			}
			return;
		}

		const configNames = Object.keys(selectedFitEntry.trace_url_dict ?? {});
		const fallbackModelName =
			selectedFitEntry.best_model_name ?? configNames[0] ?? null;
		if (
			!selectedPlotModelName ||
			!configNames.includes(selectedPlotModelName)
		) {
			setSelectedPlotModelName(fallbackModelName);
			if (subtractModelList !== null) {
				setSubtractModelList(null);
			}
		}
	}, [
		selectedFitEntry,
		selectedPlotModelName,
		setSelectedPlotModelName,
		subtractModelList,
		setSubtractModelList,
	]);

	return {
		selectedSource,
		fitHistory,
		selectedFitEntry,
		selectedFitJobId,
		setSelectedFitJobId,
		selectedPlotModelName,
		setSelectedPlotModelName,
		subtractModelList,
		setSubtractModelList,
	};
}
