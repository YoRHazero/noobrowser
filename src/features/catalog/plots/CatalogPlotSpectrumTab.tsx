import { Tabs, Text } from "@chakra-ui/react";
import { usePlotCatalogSpectrum } from "@/hooks/query/plot";
import { useCatalogStore } from "../store/catalog-store";
import { PlotImagePanel } from "./PlotImagePanel";

export function CatalogPlotSpectrumTab() {
	const selectedFitJobId = useCatalogStore((state) => state.selectedFitJobId);
	const enabled = !!selectedFitJobId;
	const query = usePlotCatalogSpectrum({
		jobId: selectedFitJobId ?? "",
		enabled,
	});

	return (
		<Tabs.Content value="spectrum" p={4}>
			{!selectedFitJobId ? (
				<Text color="fg.muted">Select a fit result to view plots.</Text>
			) : (
				<PlotImagePanel
					label="Spectrum"
					blob={query.data ?? null}
					isFetching={query.isFetching}
					error={query.isError ? (query.error as Error)?.message : null}
				/>
			)}
		</Tabs.Content>
	);
}
