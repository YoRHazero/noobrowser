import { Box, Grid } from "@chakra-ui/react";
import { useState } from "react";
import type { CatalogItemResponse } from "@/hook/connection-hook";
import { CatalogDetail } from "./CatalogDetail";
import { CatalogList } from "./CatalogList";

export function CatalogFeature() {
	const [selectedItem, setSelectedItem] = useState<CatalogItemResponse | null>(
		null,
	);

	return (
		<Grid
			templateColumns="350px 1fr"
			h="100vh" // Or use a calculated height if strictly required, but 100vh is a good default for full screen
			gap={4}
			p={4}
		>
			<Box
				overflowY="auto"
				borderRightWidth="1px"
				borderColor="border.muted"
				pr={2}
			>
				<CatalogList
					selectedId={selectedItem?.id ?? null}
					onSelect={setSelectedItem}
				/>
			</Box>
			<Box overflowY="auto" h="full">
				{selectedItem ? (
					<CatalogDetail item={selectedItem} />
				) : (
					<Box p={4} color="fg.muted">
						Select an item to view details
					</Box>
				)}
			</Box>
		</Grid>
	);
}
