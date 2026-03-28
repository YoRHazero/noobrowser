import { Box } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import OverviewFeature from "@/features/overview";

export const Route = createFileRoute("/test")({
	component: TestRoute,
});

function TestRoute() {
	return (
		<Box w="100%" h="calc(100dvh - 49px)">
			<OverviewFeature />
		</Box>
	);
}
