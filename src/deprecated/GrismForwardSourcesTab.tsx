import { 
    Box, 
    Card, 
    HStack, 
    Stack, 
    Text, 
    Badge, 
    Checkbox,
    NumberInput, 
    Select, 
    createListCollection,
    Flex, 
    IconButton, 
    Link,
    Separator,
    Popover,
    Input,
    Portal
} from "@chakra-ui/react";
import { useConnectionStore } from "@/stores/connection";
import { useFitJobStatusQuery } from "@/hook/connection-hook";
import { toaster } from "@/components/ui/toaster";
import type { TraceSource } from "@/stores/stores-types";
import { 
    CheckCircle2, 
    Play, 
    FileText, 
    AlertTriangle,
    Check,
    Trash2,
    X,
    List,
    Pencil
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
// Stores
import { useSourcesStore } from "@/stores/sources";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
// Hooks
import { useSubmitFitJobMutation } from "@/hook/connection-hook";


export default function GrismForwardSourcesTab() {
    // --- Stores ---
    const traceSources = useSourcesStore(useShallow((s) => s.traceSources));
    const setForwardSourcePosition = useGrismStore((s) => s.setForwardSourcePosition);
    const getSelectedConfiguration = useFitStore((s) => s.getSelectedConfiguration);

    // --- Local State ---
    const [apertureSize, setApertureSize] = useState(5);
    const [extractMode, setExtractMode] = useState<string[]>(["GRISMR"]);
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

    // --- Mutation Hook ---
    const { mutate: submitJob, isPending: isSubmitting } = useSubmitFitJobMutation();

    // --- Derived Data ---
    const readySources = traceSources.filter((s) => s.spectrumReady);

    // --- Handlers ---
    const handleRunFit = (sourceId: string) => {
        const selectedConfigs = getSelectedConfiguration();
        if (selectedConfigs.length === 0) {
            toaster.create({
                description: "Please select at least one Fit Configuration.",
                type: "warning",
            });
            return;
        }

        submitJob({
            sourceId,
            extractionConfig: {
                aperture_size: apertureSize,
                extraction_mode: extractMode[0] as "GRISMR" | "GRISMC",
            },
            // fitConfigs left undefined to let hook use selected configs from store
        });
    };

    const handleSelectSource = (source: TraceSource) => {
        setSelectedSourceId(source.id);
        setForwardSourcePosition({
            x: Math.round(source.x),
            y: Math.round(source.y),
        });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={4}
            p={4}
            width="full"
            height="100%"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="md"
            bg="bg.surface"
            overflow="hidden"
        >
            {/* Top: Configurations */}
            <FitConfigurationList />

            <Separator />

            {/* Middle: Extraction Parameters */}
            <ExtractionSettings 
                apertureSize={apertureSize}
                setApertureSize={setApertureSize}
                extractMode={extractMode}
                setExtractMode={setExtractMode}
            />

            <Separator />

            {/* Bottom: Sources List */}
            <TargetSourceList 
                readySources={readySources}
                selectedSourceId={selectedSourceId}
                onSelectSource={handleSelectSource}
                onRunFit={handleRunFit}
                isSubmitting={isSubmitting}
            />
        </Box>
    );
}

interface RenamePopoverProps {
    id: string;
    currentName: string;
    onRename: (id: string, name: string) => void;
}

function RenameConfigPopover({ id, currentName, onRename }: RenamePopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempName, setTempName] = useState(currentName);

    const handleSave = () => {
        if (tempName.trim()) {
            onRename(id, tempName);
        } else {
            setTempName(currentName); // Revert if empty
        }
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTempName(currentName);
        setIsOpen(false);
    };

    return (
        <Popover.Root 
            open={isOpen} 
            onOpenChange={(e) => setIsOpen(e.open)}
            positioning={{ placement: "top" }}
        >
            <Popover.Trigger asChild>
                <IconButton
                    aria-label="Rename config"
                    size="xs"
                    variant="ghost"
                    colorPalette="gray"
                    h="20px" minW="20px"
                    onClick={(e) => {
                        e.stopPropagation(); // 阻止冒泡，不触发选中
                        setIsOpen(true);
                    }}
                >
                    <Pencil size={12} />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content width="200px">
                        <Popover.Body p={2}>
                            <HStack gap={1}>
                                <Input 
                                    size="xs" 
                                    value={tempName} 
                                    onChange={(e) => setTempName(e.target.value)}
                                    onKeyDown={(e) => {
                                        e.stopPropagation(); // 防止触发快捷键
                                        if (e.key === 'Enter') handleSave();
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <IconButton 
                                    aria-label="Save" 
                                    size="xs" 
                                    colorPalette="green" 
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSave();
                                    }}
                                >
                                    <Check size={14} />
                                </IconButton>
                                <IconButton 
                                    aria-label="Cancel" 
                                    size="xs" 
                                    colorPalette="red" 
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel();
                                    }}
                                >
                                    <X size={14} />
                                </IconButton>
                            </HStack>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
}

export function FitConfigurationList() {
    const { 
        configurations, 
        toggleConfigurationSelection,
        removeConfiguration,
        setConfigurationName // 获取重命名方法
    } = useFitStore(
        useShallow((s) => ({
            configurations: s.configurations,
            toggleConfigurationSelection: s.toggleConfigurationSelection,
            removeConfiguration: s.removeConfiguration, 
            setConfigurationName: s.setConfigurationName,
        }))
    );

    return (
        <Stack gap={2} flexShrink={0}>
            <HStack justify="space-between">
                <Text fontWeight="medium" fontSize="sm">
                    Fit Configurations
                </Text>
                <Badge variant="surface">{configurations.length}</Badge>
            </HStack>

            {configurations.length === 0 ? (
                <Box
                    p={4}
                    border="1px dashed"
                    borderColor="border.subtle"
                    borderRadius="md"
                    textAlign="center"
                >
                    <Text fontSize="xs" color="gray.500">
                        No saved configurations.
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                        Create & Save in "Fit Panel"
                    </Text>
                </Box>
            ) : (
                <Box
                    overflowX="auto"
                    whiteSpace="nowrap"
                    pb={2}
                    className="custom-scrollbar"
                >
                    <HStack gap={2}>
                        {configurations.map((config) => (
                            <Card.Root
                                key={config.id}
                                size="sm"
                                minW="160px" 
                                variant={config.selected ? "subtle" : "outline"}
                                borderColor={config.selected ? "cyan.400" : "border.subtle"}
                                cursor="pointer"
                                onClick={() => toggleConfigurationSelection(config.id)}
                            >
                                <Card.Body p={2}>
                                    <Stack gap={1}>
                                        {/* Row 1: Name & Checkbox */}
                                        <HStack justify="space-between" align="start">
                                            <Text
                                                fontWeight="bold"
                                                fontSize="xs"
                                                truncate
                                                maxW="110px"
                                                title={config.name}
                                            >
                                                {/* [修正] 使用 config.name */}
                                                {config.name} 
                                            </Text>
                                            <Checkbox.Root
                                                checked={config.selected}
                                                size="xs"
                                                pointerEvents="none"
                                                colorPalette="cyan"
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                            </Checkbox.Root>
                                        </HStack>

                                        {/* Row 2: Info & Actions */}
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="xs" color="gray.500">
                                                {config.models.length} Models
                                            </Text>
                                            
                                            <HStack gap={0}>
                                                {/* 重命名按钮 */}
                                                <RenameConfigPopover 
                                                    id={config.id} 
                                                    currentName={config.name}
                                                    onRename={setConfigurationName}
                                                />

                                                {/* 删除按钮 */}
                                                <IconButton
                                                    aria-label="Delete config"
                                                    size="xs"
                                                    variant="ghost"
                                                    colorPalette="red"
                                                    h="20px" minW="20px"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeConfiguration(config.id);
                                                    }}
                                                >
                                                    <Trash2 size={12} />
                                                </IconButton>
                                            </HStack>
                                        </HStack>
                                    </Stack>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </HStack>
                </Box>
            )}
        </Stack>
    );
}

const extractModeCollection = createListCollection({
    items: [
        { label: "GRISMR", value: "GRISMR" },
        { label: "GRISMC", value: "GRISMC" },
    ],
});

interface ExtractionSettingsProps {
    apertureSize: number;
    setApertureSize: (val: number) => void;
    extractMode: string[];
    setExtractMode: (val: string[]) => void;
}

export function ExtractionSettings({
    apertureSize,
    setApertureSize,
    extractMode,
    setExtractMode
}: ExtractionSettingsProps) {
    return (
        <Stack gap={2} flexShrink={0}>
            <Text fontWeight="medium" fontSize="sm">
                Extraction Settings
            </Text>
            <HStack gap={2}>
                <Box flex={1}>
                    <Text fontSize="xs" mb={1} color="gray.500">
                        Aperture (px)
                    </Text>
                    <NumberInput.Root
                        size="xs"
                        value={apertureSize.toString()}
                        onValueChange={(e) => setApertureSize(Number(e.value))}
                        min={1}
                        max={50}
                    >
                        <NumberInput.Control />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </Box>
                <Box flex={1}>
                    <Text fontSize="xs" mb={1} color="gray.500">
                        Mode
                    </Text>
                    <Select.Root
                        collection={extractModeCollection}
                        size="xs"
                        value={extractMode}
                        onValueChange={(e) => setExtractMode(e.value)}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText />
                            </Select.Trigger>
                        </Select.Control>
                        <Select.Positioner>
                            <Select.Content>
                                {extractModeCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Select.Root>
                </Box>
            </HStack>
        </Stack>
    );
}




// --- Sub-Component: Single Item --- //
interface SourceItemProps {
    source: TraceSource;
    isSelected: boolean;
    onSelect: () => void;
    onRun: () => void;
    isSubmitting: boolean;
}

function SourceItem({
    source,
    isSelected,
    onSelect,
    onRun,
    isSubmitting,
}: SourceItemProps) {
    const { data: jobData } = useFitJobStatusQuery(source.id);
    const backendUrl = useConnectionStore((state) => state.backendUrl);

    // 优先显示 query 结果，降级显示 store 中的状态
    const status = jobData?.status ?? source.fitState?.jobStatus;
    const result = jobData?.result;

    const statusColorPalette: Record<string, string> = {
        pending: "gray",
        processing: "blue",
        completed: "green",
        failed: "red",
    };

    // 解析结果链接
    const bestModelName = result?.best_model_name;
    const bestResult = bestModelName && result?.results ? result.results[bestModelName] : null;
    const plotUrl = bestResult ? `${backendUrl}${bestResult.plot_file_url}` : null;

    return (
        <Flex
            p={3}
            border="1px solid"
            borderColor={isSelected ? "cyan.400" : "border.subtle"}
            borderRadius="md"
            bg={isSelected ? "cyan.subtle" : "bg.subtle"}
            justify="space-between"
            align="center"
            transition="all 0.2s"
            _hover={{ borderColor: "cyan.400" }}
            onClick={onSelect}
            cursor="pointer"
        >
            <HStack gap={3}>
                <Box
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    bg={source.color}
                    boxShadow={`0 0 4px ${source.color}`}
                />
                <Stack gap={0}>
                    <HStack>
                        <Text fontSize="xs" fontWeight="bold" fontFamily="mono">
                            ID: {source.id.slice(0, 6).toUpperCase()}
                        </Text>
                        {status && (
                            <Badge 
                                size="xs" 
                                variant="solid" 
                                colorPalette={statusColorPalette[status] || "gray"}
                            >
                                {status}
                            </Badge>
                        )}
                    </HStack>
                    <Text fontSize="xs" color="gray.500" fontFamily="mono">
                        XY: {source.x.toFixed(1)}, {source.y.toFixed(1)}
                    </Text>
                </Stack>
            </HStack>

            <HStack>
                {status === "completed" && plotUrl && (
                    <Link href={plotUrl} target="_blank" onClick={(e) => e.stopPropagation()}>
                        <IconButton aria-label="View Result" size="xs" variant="ghost" colorPalette="green">
                            <FileText size={14} />
                        </IconButton>
                    </Link>
                )}
                {status === "failed" && (
                     <IconButton 
                        aria-label="Error" 
                        size="xs" 
                        variant="ghost" 
                        colorPalette="red"
                        onClick={(e) => {
                            e.stopPropagation();
                            toaster.error({ title: "Job Failed", description: jobData?.error || "Unknown error" });
                        }}
                    >
                        <AlertTriangle size={14} />
                    </IconButton>
                )}
                <IconButton
                    aria-label="Run Fit"
                    size="xs"
                    variant={status === "processing" ? "subtle" : "solid"}
                    colorPalette="cyan"
                    loading={isSubmitting || status === "processing"}
                    disabled={isSubmitting || status === "processing"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRun();
                    }}
                >
                    <Play size={14} fill="currentColor" />
                </IconButton>
            </HStack>
        </Flex>
    );
}

// --- Main List Component --- //
interface TargetSourceListProps {
    readySources: TraceSource[];
    selectedSourceId: string | null;
    onSelectSource: (source: TraceSource) => void;
    onRunFit: (sourceId: string) => void;
    isSubmitting: boolean;
}

export function TargetSourceList({
    readySources,
    selectedSourceId,
    onSelectSource,
    onRunFit,
    isSubmitting
}: TargetSourceListProps) {
    return (
        <Stack gap={2} flex={1} overflow="hidden">
            <HStack justify="space-between">
                <HStack>
                    <List size={16} />
                    <Text fontWeight="medium" fontSize="sm">
                        Target Sources
                    </Text>
                </HStack>
                <Badge colorPalette="green" variant="solid">
                    {readySources.length}
                </Badge>
            </HStack>

            {readySources.length === 0 ? (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    flex={1}
                    color="gray.500"
                    textAlign="center"
                >
                    <CheckCircle2 size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <Text fontSize="sm">No ready sources.</Text>
                    <Text fontSize="xs">Extract sources in Trace drawer first.</Text>
                </Flex>
            ) : (
                <Box
                    overflowY="auto"
                    flex={1}
                    pr={1}
                    className="custom-scrollbar"
                >
                    <Stack gap={2}>
                        {readySources.map((source) => (
                            <SourceItem
                                key={source.id}
                                source={source}
                                isSelected={selectedSourceId === source.id}
                                onSelect={() => onSelectSource(source)}
                                onRun={() => onRunFit(source.id)}
                                isSubmitting={isSubmitting}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}