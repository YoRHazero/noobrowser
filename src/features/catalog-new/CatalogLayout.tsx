"use client";

import { Box, Heading, useSlotRecipe } from "@chakra-ui/react";
import { CatalogTable } from "./CatalogTable";
import { CatalogDetail } from "./CatalogDetail";
import { useCatalogStore } from "./store/catalog-store";
import { useShallow } from "zustand/react/shallow";
import { catalogLayoutRecipe } from "./recipes/catalog-layout.recipe";

export function CatalogLayout() {
  const selectedSourceId = useCatalogStore(
    useShallow((state) => state.selectedSourceId),
  );

  const recipe = useSlotRecipe({ recipe: catalogLayoutRecipe });
  const styles = recipe({});

  return (
    <Box css={styles.root}>
      {/* Left Panel: List */}
      <Box css={styles.leftPanel}>
        <Box css={styles.header}>
           <Heading size="md">Source Catalog</Heading>
        </Box>
        <Box flex={1} overflow="hidden">
           <CatalogTable />
        </Box>
      </Box>

      {/* Right Panel: Detail & Plot */}
      <Box css={styles.rightPanel}>
        {selectedSourceId ? (
          <CatalogDetail />
        ) : (
          <Box p={4} color="fg.muted" textAlign="center">
            Select a source to view details.
          </Box>
        )}
      </Box>
    </Box>
  );
}
