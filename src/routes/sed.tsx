import { Box } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/sed")({
    component: TestRoute,
});

function TestRoute() {
    return (
        <Box w="100%" h="100vh">
        </Box>
    );
}