import {
    Box,
    Flex,
    HStack,
    Stack,
    Text,
    Badge,
    IconButton,
    useSlotRecipe
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import {  Trash2, Ban, Zap, Globe } from "lucide-react";
import type { TraceSource } from "@/stores/stores-types";
import { useSourceCard } from "./hooks/useSourceCard";
import { sourceCardRecipe } from "./recipes/source-card.recipe";
export default function SourceCard({ source }: { source: TraceSource }) {
    const {
        // state
        isMain,

        // world coordinate format
        useDms,
        toggleFormat,

        // queries
        spectrumQuery,

        // settings validity
        isSettingsValid,
        sourceHasRaDec,
        canFetchSpec,

        // handlers
        fetchSpectrum,
        setAsMainSource,
        deleteSpectrum,
        removeSource,
    } = useSourceCard(source);
    const recipe = useSlotRecipe({ recipe: sourceCardRecipe });
    const styles = recipe({
        selected: isMain,
        processing: spectrumQuery.isFetching,
    })
    return (
        <Box
            onClick={setAsMainSource}
            css={styles.root}
        >
            <Flex justify="space-between" align="start">
                <HStack gap={3} align="start">
                    {/* indicator */}
                    <Box
                        css={styles.indicator}
                        style={{
                            backgroundColor: source.color,
                            boxShadow: `0 0 8px ${source.color}`,
                        }}
                    />
                    
                    <Stack gap={1}>
                        {/* Header */}
                        <Text css={styles.headerText}>
                            {source.id.slice(0,8).toUpperCase()}
                        </Text>
                        <HStack gap={1}>
                            {isMain && (
                                <Badge colorPalette={"cyan"} size={"xs"} variant={"solid"}>
                                    MAIN
                                </Badge>
                            )}
                            {source.spectrumReady ? (
                                <Badge colorPalette={"green"} size={"xs"} variant={"solid"}>
                                    READY
                                </Badge>
                            ) : spectrumQuery.isFetching ? (
                                <Badge colorPalette={"yellow"} size={"xs"} variant={"solid"}>
                                    Loading
                                </Badge>
                            ) : null}
                        </HStack>
                        <Stack gap={0}>
                            <Text css={styles.subText}>
                                XY: {source.x.toFixed(1)}, {source.y.toFixed(1)}
                            </Text>
                            <Tooltip
                                content={useDms ? "Click to Switch to Degrees" : "Click to Switch to DMS"}
                            >
                                <HStack 
                                    cursor ={ sourceHasRaDec ? "pointer" : "default"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFormat();
                                    }}
                                    h="18px"
                                    _hover={{color: sourceHasRaDec ? "cyan.300" : undefined }}
                                >
                                    <Globe size={10} color="#718096"/>
                                    <Text css={styles.subText}>
                                        {sourceHasRaDec ? 
                                            useDms ?
                                            `${source.raHms ?? "N/A"}, ${source.decDms ?? "N/A"}` :
                                            `${source.ra?.toFixed(5) ?? "N/A"}, ${source.dec?.toFixed(5) ?? "N/A"}`
                                            : "Loading Coords..."}
                                    </Text>
                                </HStack>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </HStack>

                {/* Action Buttons */}
                <Box css={styles.actionGroup}>
                    <Tooltip content="Delete Source">
                        <IconButton
                            aria-label="Delete Source"
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSource();
                            }}
                        >
                            <Trash2 size={14} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip 
                        content={source.spectrumReady || spectrumQuery.isFetching ? "Delete Spectrum" : 
                            isSettingsValid ? "Fetch Spectrum" : "Invalid Settings"}
                    >
                        <IconButton
                            aria-label="Toggle Spectrum"
                            size="xs"
                            variant={
                                source.spectrumReady || spectrumQuery.isFetching ? "solid" : "outline"
                            }
                            colorPalette={
                                source.spectrumReady || spectrumQuery.isFetching ? "red" : "cyan"
                            }
                            disabled={
                                !source.spectrumReady && !spectrumQuery.isFetching && !canFetchSpec
                            }
                            loading={spectrumQuery.isFetching}
                            onClick={(e) => {
                                e.stopPropagation();
                                source.spectrumReady || spectrumQuery.isFetching ? 
                                    deleteSpectrum() : 
                                    fetchSpectrum();
                            }}
                        >
                            {source.spectrumReady || spectrumQuery.isFetching ? (
                                <Ban size={14} />
                            ) : (
                                <Zap size={14} />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Flex>
        </Box>
    )
}
    
