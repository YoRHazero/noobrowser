import { HStack, Stack } from "@chakra-ui/react";
import Grism1DCanvas from "@/features/grism/GrismForward1DCanvas";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";
import GrismForwardTab from "@/features/grism/GrismForwardTab";
import GrismForwardToolbar from "./GrismForwardToolbar";
import CanvasWithToolbar from "@/components/layout/CanvasWithToolbar";
export default function GrismForward() {
	return (
		<HStack alignItems={"stretch"} height={"100%"}>
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
