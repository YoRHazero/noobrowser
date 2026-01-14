import { VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import Title from "@/components/layout/Title";
import Footprint from "@/features/Footprint";
import Grism from "@/features/Grism";

export const Route = createFileRoute("/inspector")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<VStack align="start" p={4} gap={4} gapY={20} height="100%" overflow="auto">
			<Title />
			<Footprint />
			{/*			<Counterpart /> */}
			<Grism />
		</VStack>
	);
}
