import { 
    Box, 
    createListCollection, 
    HStack, 
    Select, 
    Text, 
    VStack,
    Portal
} from "@chakra-ui/react";
import { useMemo } from "react";

interface FilterSelectorCardProps {
    label: string;          // "R", "G", "B"
    value: string;          // 当前 Filter 值 (e.g. "F444W")
    options: string[];      // Filter 选项列表
    isActive: boolean;      // 当前卡片是否处于“显示模式”
    color: string;          // 主题色 (e.g. "red.400")
    
    // Events
    onFilterChange: (value: string) => void; // 改变 filterRGB
    onCardClick: () => void;                 // 改变 displayMode
}

export function FilterSelectorCard({
    label,
    value,
    options,
    isActive,
    color,
    onFilterChange,
    onCardClick,
}: FilterSelectorCardProps) {

    // 1. 数据源
    const collection = useMemo(() => 
        createListCollection({ 
            items: options.map(opt => ({ label: opt, value: opt })) 
        }), 
    [options]);

    // 2. 动态样式
    // 激活时使用主题色，未激活时使用灰色/透明
    const borderColor = isActive ? color : "whiteAlpha.100";
    const headerBg = isActive ? "whiteAlpha.200" : "transparent";
    const labelColor = isActive ? color : "gray.500";
    // 未激活时稍微降低整体透明度，突出焦点
    const opacity = isActive ? 1 : 0.7;

    return (
        <Box
            w="32%" // 配合父容器的 Flex 布局
            minW="80px"
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            bg="blackAlpha.400"
            transition="all 0.2s ease-in-out"
            opacity={opacity}
            position="relative"
            overflow="hidden"
            cursor="pointer"
            onClick={onCardClick} // <--- 点击卡片切换 displayMode
            _hover={{ 
                borderColor: isActive ? color : "whiteAlpha.400",
                opacity: 1 
            }}
        >
            <VStack gap={0} align="stretch">
                {/* === Header: Label === */}
                <Box
                    px={2}
                    py={1}
                    bg={headerBg}
                    borderBottomWidth="1px"
                    borderBottomColor={isActive ? "whiteAlpha.200" : "transparent"}
                    transition="background 0.2s"
                >
                    <HStack justify="space-between" align="center">
                        <Text 
                            fontSize="xs" 
                            fontWeight="bold" 
                            color={labelColor}
                        >
                            {label}
                        </Text>
                        
                        {/* 如果激活，显示一个小光点，增强视觉反馈 */}
                        {isActive && (
                            <Box 
                                boxSize="6px" 
                                borderRadius="full" 
                                bg={color} 
                                boxShadow={`0 0 6px ${color}`}
                            />
                        )}
                    </HStack>
                </Box>

                {/* === Body: Selector === */}
                <Box p={1} onClick={(e) => e.stopPropagation()}> 
                    {/* ^^^ 关键：阻止点击冒泡，防止点击 Select 空白处触发 Card Click */}
                    
                    <Select.Root
                        collection={collection}
                        size="xs"
                        value={[value]}
                        onValueChange={(e) => onFilterChange(e.value[0])}
                    >
                        <Select.Trigger 
                            bg="transparent" 
                            border="none" 
                            color={value ? "gray.200" : "gray.600"}
                            px={1}
                            h="20px"
                            fontSize="xs"
                            fontFamily="mono"
                            width="100%"
                            _hover={{ bg: "whiteAlpha.100" }}
                            justifyContent="center"
                            // 再次确保点击 Trigger 不会冒泡
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <Select.ValueText placeholder="-" />
                        </Select.Trigger>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content 
                                    bg="gray.900" 
                                    borderColor="whiteAlpha.200" 
                                    zIndex={1500}
                                >
                                    {collection.items.map((item) => (
                                        <Select.Item 
                                            item={item} 
                                            key={item.value} 
                                            _hover={{ bg: "whiteAlpha.200" }}
                                            color="gray.200"
                                            fontSize="xs"
                                            fontFamily="mono"
                                            py={1}
                                        >
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
            </VStack>
        </Box>
    );
}