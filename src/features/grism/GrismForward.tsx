import {
    Box,
    HStack,
    Stack,
} from "@chakra-ui/react";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";
import GrismForwardPanel from "./GrismForwardPannel";

export default function GrismForward() {
    return (
        <HStack alignItems={"stretch"} height={"100%"}>
            <GrismForwardCanvas />
            <GrismForwardPanel />
        </HStack>
    )
}