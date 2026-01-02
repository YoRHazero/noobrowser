import { useState } from "react";
import { 
    Drawer, 
    Stack, 
    Text, 
    Flex, 
    Box, 
    CloseButton, 
    Separator 
} from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";
import type { FitModel, FitPrior } from "@/stores/stores-types"; // 引入 FitModel 类型

// 子组件
import PriorOperations from "@/features/grism/forwardprior/PriorOperations";
import PriorSelector from "@/features/grism/forwardprior/PriorSelector";
import PriorForm from "@/features/grism/forwardprior/PriorForm";
import FitConfigurationTitleEditor from "@/features/grism/forwardprior/FitConfigurationTitleEditor";

interface GrismForwardPriorDrawerProps {
    isOpen: boolean;
    onClose: () => void;

    // --- 模式 1: Smart Mode (通过 ID 连接 Store) ---
    configId?: string | null;

    // --- 模式 2: Dumb Mode (直接传入数据) ---
    // 如果 configId 为空，则必须提供以下两个 props
    models?: FitModel[];
    onUpdatePrior?: (modelId: number, paramName: string, newPrior: FitPrior | undefined) => void;
    
    // Dumb Mode 下的标题 (可选)
    title?: string;
}

export default function GrismForwardPriorDrawer({ 
    configId, 
    isOpen, 
    onClose,
    models: propModels,
    onUpdatePrior: propOnUpdatePrior,
    title = "Model Settings"
}: GrismForwardPriorDrawerProps) {
    
    // --- 1. Store Connections (Conditional) ---
    // 即使没传 configId，Hook 也会执行，但我们可以通过逻辑忽略结果
    const storeConfig = useFitStore(useShallow((s) => 
        configId ? s.configurations.find((c) => c.id === configId) : undefined
    ));
    const storeUpdateConfigurationModelPrior = useFitStore((s) => s.updateConfigurationModelPrior);

    // --- 2. Data Resolution Strategy ---
    // 优先使用 Store 中的数据，如果 Store 没数据(或没ID)，则回退到 Props
    const activeModels = configId ? storeConfig?.models : propModels;

    // 决定使用哪个更新函数
    const handleUpdatePrior = (modelId: number, paramName: string, newPrior: FitPrior | undefined) => {
        if (configId) {
            // Mode 1: Update Store Configuration
            storeUpdateConfigurationModelPrior(configId, modelId, paramName, newPrior);
        } else if (propOnUpdatePrior) {
            // Mode 2: Call Prop Callback
            propOnUpdatePrior(modelId, paramName, newPrior);
        }
    };

    // --- 3. Local UI State ---
    const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
    const [selectedParam, setSelectedParam] = useState<string | null>(null);

    // 安全检查：既没有 Store 数据，也没有 Prop 数据，则不渲染
    if (!activeModels) return null;

    return (
        <Drawer.Root 
            open={isOpen} 
            onOpenChange={(e) => !e.open && onClose()} 
            size="md"
        >
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content>
                    <Drawer.Header>
                        <Stack gap={1} w="full">
                            <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                                {configId ? "Configuration Settings" : "Active Model Settings"}
                            </Text>
                            
                            {/* 标题区域逻辑分支 */}
                            {configId ? (
                                // 如果有 Config ID，启用重命名功能
                                <FitConfigurationTitleEditor configId={configId} />
                            ) : (
                                // 否则显示静态标题
                                <Text fontWeight="bold" fontSize="md">
                                    {title}
                                </Text>
                            )}
                            
                        </Stack>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Drawer.CloseTrigger>
                    </Drawer.Header>

                    <Drawer.Body p={0}>
                        <Flex direction="column" h="full">
                            {/* 顶部：批量操作 */}
                            <Stack p={4} pb={2} gap={4}>
                                <PriorOperations
                                    allModels={activeModels}
                                    updateModelPrior={handleUpdatePrior}
                                />
                            </Stack>

                            <Separator />

                            {/* 中部：选择器 */}
                            <Flex
                                h="180px"
                                p={4}
                                justify="center"
                                bg="bg.subtle"
                                borderBottomWidth="1px"
                                borderColor="border.subtle"
                            >
                                <PriorSelector
                                    allModels={activeModels}
                                    selectedModelId={selectedModelId}
                                    selectedParam={selectedParam}
                                    onSelectModel={(id) => {
                                        setSelectedModelId(id);
                                        setSelectedParam(null);
                                    }}
                                    onSelectParam={setSelectedParam}
                                />
                            </Flex>

                            {/* 底部：表单 */}
                            <Box flex="1" overflowY="auto" p={4}>
                                {selectedModelId && selectedParam ? (
                                    <PriorForm
                                        allModels={activeModels}
                                        updateModelPrior={handleUpdatePrior}
                                        modelId={selectedModelId}
                                        paramName={selectedParam}
                                    />
                                ) : (
                                    <Stack h="full" justify="center" align="center" color="fg.muted">
                                        <Text fontSize="sm">Select a model and parameter above.</Text>
                                    </Stack>
                                )}
                            </Box>
                        </Flex>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    );
}