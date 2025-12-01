import { Box, HStack } from "@chakra-ui/react";
import { ExpandableBox } from "@/components/ui/custom-component";
import FootprintCanvas from "@/features/footprint/FootprintCanvas";
import FootprintPanel from "@/features/footprint/FootprintPanel";
import FootprintToolkit from "@/features/footprint/FootprintToolkit";

export default function Footprint() {
	return (
		<HStack
			align="start"
			gap={10}
			width="max-content"
			height="100%"
			wrap="nowrap"
		>
			<Box position="relative">
				<FootprintCanvas />
				<ExpandableBox position="absolute" top="8px" left="8px">
					<FootprintToolkit />
				</ExpandableBox>
			</Box>
			<Box
				minW="400px"
				h="600px"
				flexShrink={0}
				overflowY="auto"
				borderWidth="1px"
				borderColor="border.subtle"
				borderRadius="md"
				bg="bg"
				overscrollBehavior="contain"
			>
				<FootprintPanel />
			</Box>
		</HStack>
	);
}
