import {
  Box,
  Heading,
  Separator,
  Spinner,
  Stack,
  useSlotRecipe,
} from "@chakra-ui/react";
import { useCatalogDetail } from "./hooks/useCatalogDetail";
import { SourceMetadata } from "./metadata";
import { FitResultList } from "./components/FitResultList";
import { ConfigurationDetails } from "./configuration";
import { NedObjectList } from "./components/NedObjectList";
import { catalogDetailRecipe } from "./recipes/catalog-detail.recipe";

export function CatalogDetail() {
  const recipe = useSlotRecipe({ recipe: catalogDetailRecipe });
  const styles = recipe({});

  // Hooks
  const { data, isLoading, isError, error, selectedFitJobId, setSelectedFitJobId } = useCatalogDetail();

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4} color="red.500">
        Error loading details: {(error as Error).message}
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={4} color="fg.muted" textAlign="center">
        Select a source to view details.
      </Box>
    );
  }

  return (
    <Box css={styles.root}>
      {/* 1. Metadata Section */}
      <Stack gap={2}>
        <Heading size="sm" css={styles.header}>
          Source Metadata
        </Heading>
        <SourceMetadata />
      </Stack>

      <Separator />

      <Box>
        <NedObjectList ra={data.ra} dec={data.dec} />
      </Box>

      <Separator />

      {/* 2. Fit History Section */}
      <Stack gap={2}>
        <Heading size="sm" css={styles.header}>
          Fit History ({data.fit_history.length})
        </Heading>
        <FitResultList
          fitHistory={data.fit_history}
          selectedFitJobId={selectedFitJobId}
          onSelect={setSelectedFitJobId}
        />
      </Stack>

      <Separator />

      {/* 3. Configuration Details Section */}
      <Stack gap={2} flex={1} minH="400px">
        <ConfigurationDetails />
      </Stack>
    </Box>
  );
}
