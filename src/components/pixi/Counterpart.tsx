import {
    HStack,
    Box,
} from "@chakra-ui/react";
import CounterpartCanvas from "./CounterpartCanvas";
import CounterpartPanel from "./CounterpartPanel";
import CutoutCanvas from "./CutoutCanvas";
import CutoutPanel from "./CutoutPanel";
import { ExpandableBox } from "../ui/custom-component";
export default function Counterpart() {
    return (
        <HStack align="start" gap={20} width="max-content" height="100%" wrap="nowrap" >
                {/* Counterpart Canvas goes here */}   
                <Box position="relative">     
                    <CounterpartCanvas />
                    <ExpandableBox
                        position="absolute"
                        buttonPosition="top-left"
                        top="8px"
                        left="8px"
                    >
                        <CounterpartPanel />
                    </ExpandableBox>
                </Box>
                <Box position="relative">    
                    <CutoutCanvas />
                    <ExpandableBox
                        position="absolute"
                        buttonPosition="top-left"
                        top="8px"
                        left="8px"
                    >
                        <CutoutPanel />
                    </ExpandableBox>
                </Box>
        </HStack>
    )
}