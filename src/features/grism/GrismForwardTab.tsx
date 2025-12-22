"use client";

import { Box, HStack, Tabs, Text } from "@chakra-ui/react";
import { LuChartSpline, LuSlidersHorizontal, LuList } from "react-icons/lu";
import GrismForwardFit from "@/features/grism/GrismForwardFit";
import GrismForwardPanel from "@/features/grism/GrismForwardPanel";
import GrismForwardSourcesTab from "@/features/grism/GrismForwardTraceSources";

export default function GrismForwardTab() {
	return (
		<Box w="425px">
			<Tabs.Root defaultValue="panel" size="sm" lazyMount={true}>
				<Tabs.List>
					<Tabs.Trigger value="panel">
						<HStack gap={1} align="center">
							<LuSlidersHorizontal />
							<Text as="span">Extract</Text>
						</HStack>
					</Tabs.Trigger>
					<Tabs.Trigger value="fit">
						<HStack gap={1} align="center">
							<LuChartSpline />
							<Text as="span">Fit</Text>
						</HStack>
					</Tabs.Trigger>
					<Tabs.Trigger value="sources">
						<HStack gap={1} align="center">
							<LuList />
							<Text as="span">Sources</Text>
						</HStack>
					</Tabs.Trigger>
					<Tabs.Indicator />
				</Tabs.List>

				<Tabs.Content value="panel">
					<GrismForwardPanel />
				</Tabs.Content>

				<Tabs.Content value="fit">
					<GrismForwardFit />
				</Tabs.Content>

				<Tabs.Content value="sources">
					<GrismForwardSourcesTab />
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
}
