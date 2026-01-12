// @/features/grism/tracesource/TraceSourceDrawer.tsx
import {
    Badge,
    Button,
    CloseButton,
    Drawer,
    Flex,
    Heading,
    HStack,
    Stack,
    Text,
    Portal,
    Box
} from "@chakra-ui/react";
import { Target, ListFilter, Crosshair } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useSourcesStore } from "@/stores/sources";
import SourceCard from "@/features/grism/tracesource/SourceCard";
import GlobalControls from "@/features/grism/tracesource/GlobalControls";
import SpectrumPoller from "@/features/grism/tracesource/SpectrumPoller";

export default function TraceSourceDrawer() {
    const {
        traceMode,
        traceSources,
    } = useSourcesStore(
        useShallow((state) => ({
            traceMode: state.traceMode,
            traceSources: state.traceSources,
        }))
    );
    
    return (
        <Drawer.Root placement="end" size="md">
            <Drawer.Backdrop />
            <Drawer.Trigger asChild>
                <Button
                    position="absolute"
                    bottom="12px"
                    right="12px"
                    zIndex={10}
                    size="sm"
                    fontSize="xs"
                    variant={traceMode ? "solid" : "ghost"}
                    colorPalette={traceMode ? "cyan" : "gray"}
                    animation={traceMode ? "selected" : undefined}
                    boxShadow={traceMode ? "0 0 15px {colors.cyan.500/30}" : undefined}
                >
                    <HStack gap={2}>
                        {traceMode ? <Target size={16} /> : <ListFilter size={16} />}
                        <Text>{traceMode ? "Trace Mode" : "Source List"}</Text>
                        {traceSources.length > 0 && (
                            <Badge
                                variant="solid"
                                colorPalette={traceMode ? "cyan" : "gray"}
                                size="xs"
                            >
                                {traceSources.length}
                            </Badge>
                        )}
                        <SpectrumPoller />
                    </HStack>
                </Button>
            </Drawer.Trigger>
            <Portal>
            <Drawer.Positioner>
                {/* 
                   使用 Flex 布局确保 Body 占据剩余空间，
                   Controls 固定在底部 
                */}
                <Drawer.Content display="flex" flexDirection="column" h="100%">

                    {/* Header */}
                    <Drawer.Header flexShrink={0}>
                        <HStack justify="space-between">
                            <HStack>
                                <Crosshair
                                    size={18}
                                    color={traceMode ? "var(--chakra-colors-cyan-400)" : "var(--chakra-colors-gray-400)"}
                                />
                                <Heading size="sm" color="fg">
                                    Trace Sources
                                </Heading>
                            </HStack>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton />
                            </Drawer.CloseTrigger>
                        </HStack>
                    </Drawer.Header>
                    
                    {/* Body - Scrollable Area */}
                    <Drawer.Body 
                        className="custom-scrollbar" 
                        flex="1" 
                        overflowY="auto"
                        px={4}
                        pb={4}
                    >
                        {traceSources.length === 0 ? (
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                h="100%" // 充满可用高度
                                color="fg.muted"
                            >
                                <Target size={40} style={{ opacity: 0.5, marginBottom: 10 }} />
                                <Text fontSize="sm">No trace sources initialized.</Text>
                            </Flex>
                        ) : (
                            <Stack gap={3}>
                                {traceSources.map((source) => (
                                    <SourceCard
                                        key={source.id}
                                        source={source}
                                    />
                                ))}
                                {/* Add padding at bottom so last card isn't flush against controls */}
                                <Box h="4" />
                            </Stack>
                        )}
                    </Drawer.Body>

                    {/* Footer / Global Controls - Fixed at bottom */}
                    <Box flexShrink={0}>
                        <GlobalControls />
                    </Box>

                </Drawer.Content>
            </Drawer.Positioner>
            </Portal>   
        </Drawer.Root>
    )
}