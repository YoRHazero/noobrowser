import { 
    Box, 
    Flex, 
    HStack, 
    Stack, 
    Text, 
    Badge, 
    IconButton, 
    Link 
} from "@chakra-ui/react";
import { 
    FileText, 
    AlertTriangle, 
    Cpu, // 更名为计算图标
} from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip"; // 引入 Tooltip
import { useConnectionStore } from "@/stores/connection";
import { useFitJobStatusQuery } from "@/hook/connection-hook";
import type { TraceSource } from "@/stores/stores-types";

// --- Theme Constants ---
const THEME_STYLES = {
    container: (selected: boolean) => ({
        p: 2,
        borderRadius: "md",
        borderWidth: "1px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        
        bg: selected 
            ? { base: "cyan.50", _dark: "whiteAlpha.100" }
            : { base: "white", _dark: "transparent" },
        
        borderColor: selected 
            ? { base: "cyan.500", _dark: "cyan.500" }
            : { base: "gray.200", _dark: "whiteAlpha.100" },

        backdropFilter: selected ? { _dark: "blur(8px)" } : "none",

        _hover: {
            borderColor: selected ? "cyan.400" : "cyan.300",
            bg: selected 
                ? { base: "cyan.100", _dark: "whiteAlpha.200" } 
                : { base: "gray.50", _dark: "whiteAlpha.50" },
        }
    }),
    idText: {
        fontSize: "xs" as const,
        fontWeight: "bold" as const,
        fontFamily: "mono",
    },
    coordText: {
        fontSize: "2xs" as const,
        color: "fg.subtle",
        fontFamily: "mono",
        mt: 0.5,
    },
    // 运行按钮的特殊样式
    runButton: (isProcessing: boolean, canRun: boolean) => ({
        size: "xs" as const,
        h: "24px", 
        w: "24px", 
        minW: "24px",
        // 样式逻辑：
        // 1. 正在运行 -> 幽灵态 + 蓝色 (表示忙碌)
        // 2. 能够运行 -> 实心/表面态 + 青色 (表示就绪)
        // 3. 不能运行 -> 幽灵态 + 灰色 (表示禁用)
        variant: isProcessing ? "subtle" : (canRun ? "surface" : "ghost") as any,
        colorPalette: isProcessing ? "blue" : (canRun ? "cyan" : "gray"),
        disabled: isProcessing || !canRun,
        loading: isProcessing,
        
        // 悬停特效 (仅在可运行时)
        _hover: !isProcessing && canRun ? { 
            transform: "scale(1.1)", 
            bg: "cyan.500", 
            color: "white",
            boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)" // 发光效果
        } : undefined,
        
        transition: "all 0.2s",
    })
};

interface SourceItemProps {
    source: TraceSource;
    isSelected: boolean;
    canRun: boolean;
    onSelect: () => void;
    onRun: () => void;
}

export default function SourceItem({
    source,
    isSelected,
    canRun,
    onSelect,
    onRun,
}: SourceItemProps) {
    const { data: jobData } = useFitJobStatusQuery(source.id);
    const backendUrl = useConnectionStore((state) => state.backendUrl);

    const status = jobData?.status ?? source.fitState?.jobStatus;
    const result = jobData?.result;
    const bestModelName = result?.best_model_name;
    const bestResult = bestModelName && result?.results ? result.results[bestModelName] : null;
    const plotUrl = bestResult ? `${backendUrl}${bestResult.plot_file_url}` : null;

    const statusColorPalette: Record<string, string> = {
        pending: "gray",
        processing: "blue",
        completed: "green",
        failed: "red",
    };

    const isProcessing = status === "processing" || status === "pending";

    return (
        <Flex
            {...THEME_STYLES.container(isSelected)}
            justify="space-between"
            align="center"
            onClick={onSelect}
        >
            {/* Left: Info */}
            <HStack gap={3}>
                <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={source.color}
                    boxShadow={`0 0 6px ${source.color}`}
                    opacity={0.8}
                />
                
                <Stack gap={0}>
                    <HStack align="center" gap={2}>
                        <Text 
                            {...THEME_STYLES.idText} 
                            color={isSelected ? { base: "cyan.700", _dark: "cyan.300" } : "fg"}
                        >
                            {source.id.slice(0, 6).toUpperCase()}
                        </Text>
                        
                        {status && (
                            <Badge 
                                size="xs" 
                                variant="surface" 
                                colorPalette={statusColorPalette[status] || "gray"}
                                fontSize="2xs"
                                px={1}
                            >
                                {status.toUpperCase()}
                            </Badge>
                        )}
                    </HStack>
                    <Text {...THEME_STYLES.coordText}>
                        X:{source.x.toFixed(1)} Y:{source.y.toFixed(1)}
                    </Text>
                </Stack>
            </HStack>

            {/* Right: Actions */}
            <HStack onClick={(e) => e.stopPropagation()} gap={1}>
                {status === "completed" && plotUrl && (
                    <Tooltip content="View Result Plot">
                        <Link href={plotUrl} target="_blank">
                            <IconButton 
                                aria-label="View Result" 
                                size="xs" 
                                variant="ghost" 
                                colorPalette="green"
                                h="24px" w="24px" minW="24px"
                            >
                                <FileText size={14} />
                            </IconButton>
                        </Link>
                    </Tooltip>
                )}

                {status === "failed" && (
                     <Tooltip content={jobData?.error || "Job Failed"}>
                        <IconButton 
                            aria-label="Error" 
                            size="xs" 
                            variant="ghost" 
                            colorPalette="red"
                            h="24px" w="24px" minW="24px"
                            onClick={() => {
                                toaster.error({ 
                                    title: "Job Failed", 
                                    description: jobData?.error || "Unknown error occurred." 
                                });
                            }}
                        >
                            <AlertTriangle size={14} />
                        </IconButton>
                     </Tooltip>
                )}

                {/* --- MCMC Run Button --- */}
                <Tooltip 
                    content={isProcessing ? "Processing..." : (canRun ? "Run MCMC Analysis" : "Select a Config first")}
                    disabled={false}
                >
                    <IconButton
                        aria-label="Run MCMC Fit"
                        {...THEME_STYLES.runButton(isProcessing, canRun)}
                        onClick={onRun}
                    >
                        {/* 使用 CPU 图标代表计算任务 */}
                        <Cpu size={14} /> 
                    </IconButton>
                </Tooltip>
            </HStack>
        </Flex>
    );
}