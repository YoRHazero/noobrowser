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

	const fitHistory = useMemo(() => {
		if (!selectedSource?.fit_history) return [];
		return sortFitHistoryByCreatedAt(selectedSource.fit_history);
	}, [selectedSource]);

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

	return {
		selectedSource,
		fitHistory,
		selectedFitJobId,
		setSelectedFitJobId,
	};
}
