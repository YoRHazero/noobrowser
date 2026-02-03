"use client";

import { Box, HStack, Tabs, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { LuChartSpline, LuList, LuSlidersHorizontal } from "react-icons/lu";
import GrismForwardControl from "@/features/grism/forwardcontrol";
// Components
import GrismForwardFit from "@/features/grism/forwardfit";
import GrismForwardSource from "@/features/grism/forwardsource";

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
	return (
		<Box w="425px" h="100vh">
			<Tabs.Root
				defaultValue={TAB_ITEMS[0].value}
				size="sm"
				lazyMount={true}
				h="100%"
			>
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
					<Tabs.Content key={tab.value} value={tab.value} h="100%">
						{tab.content}
					</Tabs.Content>
				))}
			</Tabs.Root>
		</Box>
	);
}
