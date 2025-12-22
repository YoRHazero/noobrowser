import { 
    Box, 
    Button, 
    HStack, 
    Stack, 
    Text, 
    Badge, 
    Separator, 
    Flex,
} from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { Eye, CheckCircle2, List } from "lucide-react";

import { useSourcesStore } from "@/stores/sources";
import { useGrismStore } from "@/stores/image";
import { toaster } from "@/components/ui/toaster";

export default function GrismForwardSourcesTab() {
    // 1. 获取 Sources
    const traceSources = useSourcesStore(
        useShallow((state) => state.traceSources)
    );

    // 2. 获取设置 Cutout 的方法
    const setForwardSourcePosition = useGrismStore(
        (state) => state.setForwardSourcePosition
    );


    // 3. 筛选出 Ready 的 Sources
    // 只有这些 source 在 Drawer 侧已经完成了 fetch，缓存里才有数据
    const readySources = traceSources.filter(s => s.spectrumReady);

    // 4. 处理 "Show" 点击
    const handleShowSource = (source: typeof traceSources[0]) => {
        // 核心逻辑：利用 cutoutParams 反推 x, y
        // useExtractSpectrum 的逻辑是：queryX = x0 + width / 2
        // 所以我们设置 x0 = source.x - width / 2
        setForwardSourcePosition({ x: Math.round(source.x),  y: Math.round(source.y) });

        // 提示用户
        toaster.create({
            title: "Spectra Loaded (Cached)",
            description: `Switched to Source ${source.id.slice(0, 6).toUpperCase()}`,
            type: "success",
            duration: 2000,
        });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={4}
            p={4}
            width="full"
            height="900px" // 撑满 Tab 内容区域
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="md"
            bg="bg.surface"
        >
            {/* Header */}
            <HStack justify="space-between">
                <HStack>
                    <List size={16} />
                    <Text fontWeight="medium">Cached Sources</Text>
                </HStack>
                <Badge colorPalette="green" variant="solid">{readySources.length}</Badge>
            </HStack>
            
            <Separator />

            {/* List Content */}
            {readySources.length === 0 ? (
                <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10} 
                    color="gray.500"
                    textAlign="center"
                >
                    <CheckCircle2 size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <Text fontSize="sm">No ready sources.</Text>
                    <Text fontSize="xs" mt={1}>
                        Use the "Trace" drawer to extract sources first.
                    </Text>
                </Flex>
            ) : (
                <Box 
                    overflowY="auto" 
                    maxH="400px" // 给一个最大高度，或者由父容器决定
                    pr={2} // 留点空间给滚动条
                    className="custom-scrollbar"
                >
                    <Stack gap={2}>
                        {readySources.map((source) => (
                            <Flex 
                                key={source.id} 
                                p={3} 
                                border="1px solid" 
                                borderColor="border.subtle"
                                borderRadius="md"
                                bg="bg.subtle"
                                justify="space-between" 
                                align="center"
                                transition="all 0.2s"
                                _hover={{ borderColor: "cyan.400", bg: "whiteAlpha.100" }}
                            >
                                <HStack gap={3}>
                                    {/* 颜色点 */}
                                    <Box 
                                        w="10px" 
                                        h="10px" 
                                        borderRadius="full" 
                                        bg={source.color} 
                                        boxShadow={`0 0 4px ${source.color}`}
                                    />
                                    
                                    {/* 信息 */}
                                    <Stack gap={0}>
                                        <Text fontSize="xs" fontWeight="bold" fontFamily="mono">
                                            ID: {source.id.slice(0, 6).toUpperCase()}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500" fontFamily="mono">
                                            XY: {source.x.toFixed(1)}, {source.y.toFixed(1)}
                                        </Text>
                                    </Stack>
                                </HStack>

                                {/* 操作按钮 */}
                                <Button 
                                    size="xs" 
                                    variant="surface" 
                                    colorPalette="cyan"
                                    onClick={() => handleShowSource(source)}
                                >
                                    <Eye size={14} style={{ marginRight: 4 }} />
                                    Show
                                </Button>
                            </Flex>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
}