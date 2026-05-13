import { VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import Title from "@/components/layout/Title";
import ImageInspector from "@/features/image-inspector";
import OverviewFeature from "@/features/overview";
import SpectrumWorkspace from "@/features/spectrum-workspace";
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
			<SpectrumWorkspace />
			{/*			<Counterpart /> */}
			{/*			<Analyzer /> */}
			<ImageInspector />
			{/*			<Inspector /> */}
		</VStack>
	);
}
