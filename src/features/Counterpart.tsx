import { Box, HStack } from "@chakra-ui/react";
import { ExpandableBox } from "@/components/ui/custom-component";
import CounterpartCanvas from "@/features/counterpart/CounterpartCanvas";
import CounterpartPanel from "@/features/counterpart/CounterpartPanel";
import CutoutCanvas from "@/features/counterpart/CutoutCanvas";
import CutoutPanel from "@/features/counterpart/CutoutPanel";
export default function Counterpart() {
	return (
		<HStack
			align="start"
			gap={20}
			width="max-content"
			height="100%"
			wrap="nowrap"
		>
			{/* Counterpart Canvas goes here */}
			<Box position="relative">
				<CounterpartCanvas />
				<ExpandableBox
					position="absolute"
					buttonPosition="top-left"
					top="8px"
					left="8px"
				>
					<CounterpartPanel />
				</ExpandableBox>
			</Box>
			<Box position="relative">
				<CutoutCanvas />
				<ExpandableBox
					position="absolute"
					buttonPosition="top-left"
					top="8px"
					left="8px"
				>
					<CutoutPanel />
				</ExpandableBox>
			</Box>
		</HStack>
	);
}
