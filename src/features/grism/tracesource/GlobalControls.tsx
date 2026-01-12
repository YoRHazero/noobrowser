// @/features/grism/tracesource/GlobalControls.tsx
import {
  Box,
  HStack,
  Stack,
  Text,
  NumberInput,
  Button,
  Grid,
  GridItem,
  useSlotRecipe,
  Flex,
} from "@chakra-ui/react";
import { LuRefreshCw, LuTrash2, LuActivity, LuRuler } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { toaster } from "@/components/ui/toaster";
import { useGlobalControls } from "./hooks/useGlobalControls";
import { globalControlsRecipe } from "./recipes/global-controls.recipe";

export default function GlobalControls() {
  const {
    settings,
    isWaveRangeValid,
    totalSources,
    mainId,
    setSettings,
    clear,
    sync,
  } = useGlobalControls();

  const recipe = useSlotRecipe({ recipe: globalControlsRecipe });
  const styles = recipe();

  return (
    <Box css={styles.root}>
      <Box css={styles.panel}>
        
        {/* --- Settings Row --- */}
        <Grid templateColumns="1fr 2fr" gap={4}>
          
          {/* Aperture Size */}
          <GridItem>
            <Stack gap={0} position="relative">
              <Text css={styles.label}>
                <LuRuler size={10} /> Aperture
              </Text>
              <NumberInput.Root
                size="sm"
                value={settings.apertureSize.toString()}
                onValueChange={(e) => {
                  const val = parseInt(e.value);
                  if (!Number.isNaN(val) && val > 1) {
                    setSettings((prev) => ({
                      ...prev,
                      apertureSize: val,
                    }));
                  }
                }}
                min={2}
                width="100%"
              >
                <NumberInput.Input 
                    fontFamily="mono" 
                    _focus={{ borderColor: "border.accent", boxShadow: "0 0 0 1px var(--chakra-colors-border-accent)" }}
                />
              </NumberInput.Root>
            </Stack>
          </GridItem>

          {/* Wavelength Range */}
          <GridItem>
            <Stack gap={0} position="relative">
              <Flex justify="space-between" align="center">
                <Text css={styles.label}>
                  <LuActivity size={10} /> Range (μm)
                </Text>
                {/* Error Message */}
                {!isWaveRangeValid && (
                    <Text 
                        color="red.400" 
                        fontSize="xs" 
                        fontWeight="bold"
                        position="absolute"
                        right="0"
                        top="0"
                        animation="techPulse 4s infinite"

                    >
                        INVALID
                    </Text>
                )}
              </Flex>

              <HStack gap={2} width="100%">
                <NumberInput.Root
                  size="sm"
                  invalid={!isWaveRangeValid} // 手动传递 invalid
                  value={settings.waveMin.toString()}
                  onValueChange={(e) => {
                    setSettings((prev) => ({
                      ...prev,
                      waveMin: e.valueAsNumber,
                    }));
                  }}
                  width="100%"
                >
                  <NumberInput.Input fontFamily="mono" />
                </NumberInput.Root>
                
                <Text color="fg.muted">-</Text>
                
                <NumberInput.Root
                  size="sm"
                  invalid={!isWaveRangeValid} // 手动传递 invalid
                  value={settings.waveMax.toString()}
                  onValueChange={(e) => {
                    setSettings((prev) => ({
                      ...prev,
                      waveMax: e.valueAsNumber,
                    }));
                  }}
                  width="100%"
                >
                  <NumberInput.Input fontFamily="mono" />
                </NumberInput.Root>
              </HStack>
            </Stack>
          </GridItem>
        </Grid>

        {/* --- Status Bar --- */}
        <Box css={styles.statusDisplay}>
          <HStack justify="center" gap={4} separator={<Text color="border.subtle">|</Text>}>
             <Text>SRC: {totalSources.toString().padStart(2, '0')}</Text>
             <Text>MAIN: {mainId ? mainId.slice(0, 8).toUpperCase() : "N/A"}</Text>
          </HStack>
        </Box>

        {/* --- Actions --- */}
        <Box css={styles.actionGroup}>
            <Tooltip content="Clear all trace sources">
            <Button
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={() => {
                clear();
                toaster.success({
                  title: "System Purged",
                  description: `${totalSources} sources removed from buffer.`,
                });
              }}
              flex={1}
              _hover={{ bg: "red.500/10", borderColor: "red.500" }}
            >
              <LuTrash2 /> Clear All
            </Button>
          </Tooltip>
          
          <Tooltip content="Sync current ROI settings to all sources">
            <Button
              size="sm"
              variant="outline"
              colorPalette="cyan"
              onClick={() => {
                sync();
                toaster.success({
                  title: "Parameters Synced",
                  description: "ROI settings broadcast to all units.",
                });
              }}
              flex={1}
              borderColor="border.accent"
              _hover={{ 
                  bg: "cyan.500/10", 
                  boxShadow: "0 0 10px var(--chakra-colors-cyan-500-20)"
              }}
            >
              <LuRefreshCw /> Sync ROI
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}