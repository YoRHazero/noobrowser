import { Tabs, Text } from "@chakra-ui/react";
import { usePlotCatalogComparison } from "@/hooks/query/plot";
import { useCatalogStore } from "../store/catalog-store";
import { PlotImagePanel } from "./PlotImagePanel";

export function CatalogPlotComparisonTab() {
	const selectedFitJobId = useCatalogStore((state) => state.selectedFitJobId);
	const enabled = !!selectedFitJobId;
	const query = usePlotCatalogComparison({
		jobId: selectedFitJobId ?? "",
		enabled,
	});

	return (
		<Tabs.Content value="comparison" p={4}>
			{!selectedFitJobId ? (
				<Text color="fg.muted">Select a fit result to view plots.</Text>
			) : (
				<PlotImagePanel
					label="Model Comparison"
					blob={query.data ?? null}
					isFetching={query.isFetching}
					error={query.isError ? (query.error as Error)?.message : null}
				/>
			)}
		</Tabs.Content>
	);
}
