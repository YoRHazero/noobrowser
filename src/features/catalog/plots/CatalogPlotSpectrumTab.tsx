import { Box, Checkbox, HStack, Stack, Tabs, Text } from "@chakra-ui/react";
import { usePlotCatalogSpectrum } from "@/hooks/query/plot";
import { useCatalogStore } from "../store/catalog-store";
import { PlotImagePanel } from "./PlotImagePanel";

export function CatalogPlotSpectrumTab() {
	const selectedFitJobId = useCatalogStore((state) => state.selectedFitJobId);
	const selectedPlotModelName = useCatalogStore(
		(state) => state.selectedPlotModelName,
	);
	const subtractModelList = useCatalogStore(
		(state) => state.subtractModelList,
	);
	const setSubtractModelList = useCatalogStore(
		(state) => state.setSubtractModelList,
	);
	const enabled = !!selectedFitJobId;
	const showAll = subtractModelList !== null;
	const query = usePlotCatalogSpectrum({
		jobId: selectedFitJobId ?? "",
		enabled,
		model_name: selectedPlotModelName,
		subtract_model_list: showAll ? [] : null,
	});

	return (
		<Tabs.Content value="spectrum" p={4}>
			{!selectedFitJobId ? (
				<Text color="fg.muted">Select a fit result to view plots.</Text>
			) : (
				<HStack align="start" gap={6} flexWrap="wrap">
					<Box minW="200px" maxW="240px">
						<Stack gap={3}>
							<Text fontSize="xs" color="fg.muted" fontWeight="semibold">
								Subtract Models
							</Text>
							<Checkbox.Root
								checked={showAll}
								size="sm"
								colorPalette="cyan"
								onCheckedChange={(event) => {
									const nextChecked = Boolean(event.checked);
									setSubtractModelList(nextChecked ? [] : null);
								}}
							>
								<Checkbox.HiddenInput />
								<Checkbox.Control />
								<Checkbox.Label fontSize="xs" fontFamily="mono">
									{showAll ? "Show all" : "Show default"}
								</Checkbox.Label>
							</Checkbox.Root>
						</Stack>
					</Box>
					<Box flex={1} minW="240px">
						<PlotImagePanel
							label="Spectrum"
							blob={query.data ?? null}
							isFetching={query.isFetching}
							error={query.isError ? (query.error as Error)?.message : null}
						/>
					</Box>
				</HStack>
			)}
		</Tabs.Content>
	);
}
