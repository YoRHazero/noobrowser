import { HStack, Stack } from "@chakra-ui/react";
import Spectrum1DView from "@/features/grism/spectrum1d";
import Spectrum2DView from "@/features/grism/spectrum2d";
import GrismForwardTab from "@/features/grism/GrismForwardTab";
import { useScrollFocus } from "@/hooks/ui/useScrollFocus";
export default function GrismForward() {
	const containerRef = useScrollFocus<HTMLDivElement>("shift+2", {
		offset: 0,
	});
	return (
		<HStack alignItems={"stretch"} height="100vh" ref={containerRef}>
			<Stack gap={2} flex="1" minW={0} height="100%">
				<Spectrum2DView />
				<Spectrum1DView />
			</Stack>
			<GrismForwardTab />
		</HStack>
	);
}
