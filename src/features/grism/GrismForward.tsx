import { Box, HStack, Stack } from "@chakra-ui/react";
import Grism1DCanvas from "@/features/grism/Grism1DCanvas";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";
import GrismForwardTab from "@/features/grism/GrismForwardTab";
export default function GrismForward() {
	return (
		<HStack alignItems={"stretch"} height={"100%"}>
			<Stack gap={2}>
				<GrismForwardCanvas />
				<Grism1DCanvas />
			</Stack>
			<GrismForwardTab />
		</HStack>
	);
}
