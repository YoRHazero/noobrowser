import type { FitResultSummary } from "@/hooks/query/catalog";

export function sortFitHistoryByCreatedAt(history: FitResultSummary[]) {
	return [...history].sort((a, b) => {
		const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
		const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
		return bTime - aTime;
	});
}

export function getLatestFitJobId(history: FitResultSummary[]) {
	const sorted = sortFitHistoryByCreatedAt(history);
	return sorted[0]?.job_id ?? null;
}
