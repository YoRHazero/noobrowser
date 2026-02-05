import { Box, Grid, Stack } from "@chakra-ui/react";
import { CatalogFitHistoryPanel } from "./components/CatalogFitHistoryPanel";
import { CatalogListPanel } from "./components/CatalogListPanel";
import { CatalogPlotsPanel } from "./components/CatalogPlotsPanel";
import { CatalogSourceInfoPanel } from "./components/CatalogSourceInfoPanel";

export function CatalogFeature() {
	return (
		<Grid
			templateColumns={{ base: "1fr", lg: "340px 1fr" }}
			gap={4}
			p={4}
			h="100vh"
		>
			<Box
				overflowY="auto"
				borderRightWidth={{ base: "0px", lg: "1px" }}
				borderColor="border.muted"
				pr={{ base: 0, lg: 2 }}
			>
				<CatalogListPanel />
			</Box>
			<Box overflowY="auto" h="full">
				<Stack gap={4}>
					<CatalogSourceInfoPanel />
					<CatalogFitHistoryPanel />
					<CatalogPlotsPanel />
				</Stack>
			</Box>
		</Grid>
	);
}
