import {
    Box,
    HStack,
    Stack,
} from "@chakra-ui/react";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";
import GrismForwardTab from "@/features/grism/GrismForwardTab";

export default function GrismForward() {
    return (
        <HStack alignItems={"stretch"} height={"100%"}>
            <GrismForwardCanvas />
            <GrismForwardTab />
        </HStack>
    )
}