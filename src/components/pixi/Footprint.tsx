import { Box, HStack } from "@chakra-ui/react";
import FootprintCanvas from "./FootprintCanvas";
import FootprintPanel from "./FootprintPanel";

export default function Footprint() {
    return (
        <HStack align="start" gap={10} width="max-content" height="100%" wrap="nowrap">
            <FootprintCanvas />
            <Box
                minW="400px"
                h ="600px" 
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
    )
}