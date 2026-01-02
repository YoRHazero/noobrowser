import { 
    Stack, 
    HStack, 
    Text, 
    Badge, 
    Box, 
    Flex 
} from "@chakra-ui/react";
import { CheckCircle2 } from "lucide-react";
import type { TraceSource } from "@/stores/stores-types";
import SourceItem from "./SourceItem";

// --- Theme Constants ---
const THEME_STYLES = {
    heading: {
        size: "sm" as const,
        letterSpacing: "wide",
        fontWeight: "extrabold",
        textTransform: "uppercase" as const,
        color: { base: "gray.700", _dark: "transparent" },
        bgGradient: { base: "none", _dark: "to-r" },
        gradientFrom: { _dark: "cyan.400" },
        gradientTo: { _dark: "purple.500" },
        bgClip: { base: "border-box", _dark: "text" },
    },
    headerContainer: {
        justify: "space-between",
        p: 4,
        pb: 2,
        flex: "0 0 auto",
        bg: "transparent",
        borderBottomWidth: "1px",
        borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
    },
    scrollArea: {
        flex: "1",
        overflowY: "auto" as const,
        bg: "transparent",
        p: 2,
        css: {
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
                background: "var(--chakra-colors-whiteAlpha-200)",
                borderRadius: "full",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "var(--chakra-colors-whiteAlpha-400)",
            },
        },
    },
};

interface TargetSourceListProps {
    readySources: TraceSource[];
    selectedSourceId: string | null;
    hasSelectedConfig: boolean;
    onSelectSource: (source: TraceSource) => void;
    onRunFit: (sourceId: string) => void;
}

export default function TargetSourceList({
    readySources,
    selectedSourceId,
    hasSelectedConfig,
    onSelectSource,
    onRunFit
}: TargetSourceListProps) {
    return (
        <Stack gap={0} flex={1} overflow="hidden">
            {/* Header */}
            <HStack {...THEME_STYLES.headerContainer}>
                <HStack gap={2}>
                    <Text {...THEME_STYLES.heading}>
                        Target Sources
                    </Text>
                </HStack>
                <Badge colorPalette="cyan" variant="solid" size="xs">
                    {readySources.length} READY
                </Badge>
            </HStack>

            {/* Content */}
            {readySources.length === 0 ? (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    flex={1}
                    color="fg.muted"
                    textAlign="center"
                    opacity={0.6}
                >
                    <CheckCircle2 size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <Text fontSize="xs" fontWeight="bold" letterSpacing="wide">NO SOURCES READY</Text>
                    <Text fontSize="2xs" color="fg.subtle">Extract sources in "Trace" panel first</Text>
                </Flex>
            ) : (
                <Box {...THEME_STYLES.scrollArea}>
                    <Stack gap={2}>
                        {readySources.map((source) => (
                            <SourceItem
                                key={source.id}
                                source={source}
                                isSelected={selectedSourceId === source.id}
                                canRun={hasSelectedConfig}
                                onSelect={() => onSelectSource(source)}
                                onRun={() => onRunFit(source.id)}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}