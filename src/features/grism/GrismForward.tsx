import {
    Box,
    HStack,
    Stack,
} from "@chakra-ui/react";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";
import GrismForwardTab from "@/features/grism/GrismForwardTab";
import Grism1DCanvas from "@/features/grism/Grism1DCanvas";
export default function GrismForward() {
    return (
        <HStack alignItems={"stretch"} height={"100%"}>
            <Stack gap={2}>
                <GrismForwardCanvas />
                <Grism1DCanvas />
            </Stack>
            <GrismForwardTab />
        </HStack>
    )
}