import { VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import Title from "@/components/layout/Title";
import Analyzer from "@/features/analyzer/AnalyzerView";
import Inspector from "@/features/inspector/InspectorView";
import OverviewFeature from "@/features/overview";

export const Route = createFileRoute("/wfss")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<VStack
			align="stretch"
			p={4}
			gap={4}
			height="100%"
			overflowY="auto"
		>
			<Title />
			<OverviewFeature />
			{/*			<Counterpart /> */}
			<Analyzer />
			<Inspector />
		</VStack>
	);
}
