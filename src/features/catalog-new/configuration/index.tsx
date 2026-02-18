import {
  Box,
  Heading,
  Tabs,
  useSlotRecipe,
} from "@chakra-ui/react";
import { useConfigurationDetails } from "./hooks/useConfigurationDetails";
import { ModelSelector } from "./ModelSelector";
import { SpectrumTab } from "./components/SpectrumTab";
import { TraceTab } from "./components/TraceTab";
import { PosteriorTab } from "./components/PosteriorTab";
import { ComparisonTab } from "./components/ComparisonTab";
import { configurationDetailsRecipe } from "./recipes/configuration-details.recipe";

import { SummaryTab } from "./components/SummaryTab";

export function ConfigurationDetails() {
  const {
    selectedFitJobId,
    selectedModelName,
  } = useConfigurationDetails();

  const recipe = useSlotRecipe({ recipe: configurationDetailsRecipe });
  const styles = recipe();

  if (!selectedFitJobId) {
    return (
      <Box css={styles.root} justifyContent="center" alignItems="center">
        Select a Fit Job to view details
      </Box>
    );
  }

  return (
    <Box css={styles.root}>
      {/* Header & Controls */}
      <Box css={styles.header}>
        <Heading size="md">Configuration Details</Heading>
        <Box css={styles.controls}>
          <ModelSelector />
        </Box>
      </Box>

      {/* Tabs / Plot Area */}
      <Tabs.Root defaultValue="summary" css={styles.tabs} lazyMount unmountOnExit>
        <Tabs.List css={styles.tabList}>
          <Tabs.Trigger value="summary" css={styles.tabTrigger}>
            Summary
          </Tabs.Trigger>
          <Tabs.Trigger value="spectrum" css={styles.tabTrigger}>
            Spectrum
          </Tabs.Trigger>
          <Tabs.Trigger value="trace" css={styles.tabTrigger}>
            Trace
          </Tabs.Trigger>
          <Tabs.Trigger value="posterior" css={styles.tabTrigger}>
            Posterior
          </Tabs.Trigger>
          <Tabs.Trigger
            value="comparison"
            css={styles.tabTrigger}
          >
            Comparison
          </Tabs.Trigger>
        </Tabs.List>

        <Box css={styles.tabContent}>
            {selectedModelName && (
                <>
                    <Tabs.Content value="summary" h="full">
                        <SummaryTab jobId={selectedFitJobId} modelName={selectedModelName} />
                    </Tabs.Content>
                    <Tabs.Content value="spectrum" h="full">
                        <SpectrumTab jobId={selectedFitJobId} modelName={selectedModelName} />
                    </Tabs.Content>
                    <Tabs.Content value="trace" h="full">
                        <TraceTab jobId={selectedFitJobId} modelName={selectedModelName} />
                    </Tabs.Content>
                    <Tabs.Content value="posterior" h="full">
                        <PosteriorTab jobId={selectedFitJobId} modelName={selectedModelName} />
                    </Tabs.Content>
                </>
            )}
          <Tabs.Content value="comparison" h="full">
            <ComparisonTab jobId={selectedFitJobId} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
