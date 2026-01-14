import { HStack, Stack } from "@chakra-ui/react";
import Grism1DCanvas from "@/features/grism/GrismForward1DCanvas";
import GrismForward2dCanvas from "@/features/grism/GrismForward2dCanvas";
import GrismForwardTab from "@/features/grism/GrismForwardTab";
import { useScrollFocus } from "@/hook/hotkey-hook";
export default function GrismForward() {
	const containerRef = useScrollFocus<HTMLDivElement>("shift+2", {
		offset: 0,
	});
	return (
		<HStack alignItems={"stretch"} height="100vh" ref={containerRef}>
			<Stack gap={2} flex="1" minW={0} height="100%">
				<GrismForward2dCanvas />
				<Grism1DCanvas />
			</Stack>
			<GrismForwardTab />
		</HStack>
	);
}
