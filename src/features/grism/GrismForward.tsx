import { HStack, Stack } from "@chakra-ui/react";
import { useScrollFocus } from "@/hook/hotkey-hook";
import Grism1DCanvas from "@/features/grism/GrismForward1DCanvas";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";
import GrismForwardTab from "@/features/grism/GrismForwardTab";
import GrismForwardToolbar from "@/features/grism/GrismForwardToolbar";
import CanvasWithToolbar from "@/components/layout/CanvasWithToolbar";
export default function GrismForward() {
	const containerRef = useScrollFocus<HTMLDivElement>(
		"shift+2",
		{
			offset: 0,
		}
	);
	return (
		<HStack alignItems={"stretch"} height={"100%"} ref={containerRef}>
			<Stack gap={2}>
				<CanvasWithToolbar
					canvas={<GrismForwardCanvas />}
					toolbar={<GrismForwardToolbar />}
					width={900}
				/>
				<Grism1DCanvas />
			</Stack>
			<GrismForwardTab />
		</HStack>
	);
}
