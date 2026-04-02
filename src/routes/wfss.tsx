import { VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import Title from "@/components/layout/Title";
import Analyzer from "@/features/analyzer/AnalyzerView";
import Inspector from "@/features/inspector/InspectorView";
import OverviewFeature from "@/features/overview";
import TargetHubRoot from "@/features/target-hub";

export const Route = createFileRoute("/wfss")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<VStack align="stretch" p={4} gap={4} height="100%" overflowY="auto">
			<Title />
			<TargetHubRoot />
			<OverviewFeature />
			{/*			<Counterpart /> */}
			<Analyzer />
			<Inspector />
		</VStack>
	);
}
