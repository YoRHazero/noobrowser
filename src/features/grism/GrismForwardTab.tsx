"use client";

import { Box, HStack, Tabs, Text } from "@chakra-ui/react";
import { LuChartSpline, LuSlidersHorizontal, LuList } from "react-icons/lu";
import type { IconType } from "react-icons";

// Components
import GrismForwardFit from "@/features/grism/GrismForwardFit";
import GrismForwardControl from "@/features/grism/GrismForwardControl";
import GrismForwardSource from "@/features/grism/GrismForwardSource";
import { useScrollFocus } from "@/hook/hotkey-hook";
// --- 1. 定义 Tab 配置结构 ---
interface TabConfig {
    value: string;
    title: string;
    icon: IconType;
    content: React.ReactNode;
}

// --- 2. 配置数组 (在此处添加、删除或排序 Tab) ---
const TAB_ITEMS: TabConfig[] = [
    {
        value: "panel",
        title: "Extract",
        icon: LuSlidersHorizontal,
        content: <GrismForwardControl />,
    },
    {
        value: "fit",
        title: "Fit",
        icon: LuChartSpline,
        content: <GrismForwardFit />,
    },
    {
        value: "sources",
        title: "Sources",
        icon: LuList,
        content: <GrismForwardSource />,
    },
];

export default function GrismForwardTab() {
	const containerRef = useScrollFocus<HTMLDivElement>(
		"mod+shift+f",
		{
			offset: 20,
		}
	);
    return (
        <Box w="425px" ref={containerRef}>
            <Tabs.Root defaultValue={TAB_ITEMS[0].value} size="sm" lazyMount={true}>
                
                <Tabs.List>
                    {TAB_ITEMS.map((tab) => (
                        <Tabs.Trigger key={tab.value} value={tab.value}>
                            <HStack gap={1} align="center">
                                <tab.icon />
                                <Text as="span">{tab.title}</Text>
                            </HStack>
                        </Tabs.Trigger>
                    ))}
                    <Tabs.Indicator />
                </Tabs.List>

                {TAB_ITEMS.map((tab) => (
                    <Tabs.Content key={tab.value} value={tab.value}>
                        {tab.content}
                    </Tabs.Content>
                ))}

            </Tabs.Root>
        </Box>
    );
}