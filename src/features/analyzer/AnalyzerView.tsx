import { HStack, Stack } from "@chakra-ui/react";
import Spectrum1DView from "@/features/analyzer/spectrum1d";
import Spectrum2DView from "@/features/analyzer/spectrum2d";
import AnalyzerSidebar from "@/features/analyzer/AnalyzerSidebar";
import { useScrollFocus } from "@/hooks/ui/useScrollFocus";

export default function AnalyzerView() {
	const containerRef = useScrollFocus<HTMLDivElement>("shift+2", {
		offset: 0,
	});

	return (
		<HStack alignItems={"stretch"} height="100vh" ref={containerRef}>
			<Stack gap={2} flex="1" minW={0} height="100%">
				<Spectrum2DView />
				<Spectrum1DView />
			</Stack>
			<AnalyzerSidebar />
		</HStack>
	);
}
