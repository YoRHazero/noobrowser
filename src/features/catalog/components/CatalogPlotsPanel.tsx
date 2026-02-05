import { Box, Heading, Tabs, Text } from "@chakra-ui/react";
import { CatalogPlotComparisonTab } from "../plots/CatalogPlotComparisonTab";
import { CatalogPlotPosteriorTab } from "../plots/CatalogPlotPosteriorTab";
import { CatalogPlotSpectrumTab } from "../plots/CatalogPlotSpectrumTab";
import { CatalogPlotTraceTab } from "../plots/CatalogPlotTraceTab";
import { useCatalogStore } from "../store/catalog-store";

export function CatalogPlotsPanel() {
	const selectedSource = useCatalogStore((state) => state.selectedSource);
	const selectedFitJobId = useCatalogStore((state) => state.selectedFitJobId);

	if (!selectedSource) {
		return (
			<Box
				p={4}
				borderWidth="1px"
				borderColor="border.muted"
				borderRadius="lg"
				bg="bg.surface"
			>
				<Text color="fg.muted">Select a source to view plots.</Text>
			</Box>
		);
	}

	return (
		<Box
			p={4}
			borderWidth="1px"
			borderColor="border.muted"
			borderRadius="lg"
			bg="bg.surface"
		>
			<Heading size="sm" mb={3}>
				Catalog Plots
			</Heading>

			{!selectedFitJobId ? (
				<Text color="fg.muted">No fit result selected.</Text>
			) : (
				<Tabs.Root defaultValue="comparison" variant="enclosed">
					<Tabs.List>
						<Tabs.Trigger value="comparison">Comparison</Tabs.Trigger>
						<Tabs.Trigger value="spectrum">Spectrum</Tabs.Trigger>
						<Tabs.Trigger value="posterior">Posterior</Tabs.Trigger>
						<Tabs.Trigger value="trace">Trace</Tabs.Trigger>
					</Tabs.List>

					<CatalogPlotComparisonTab />
					<CatalogPlotSpectrumTab />
					<CatalogPlotPosteriorTab />
					<CatalogPlotTraceTab />
				</Tabs.Root>
			)}
		</Box>
	);
}
