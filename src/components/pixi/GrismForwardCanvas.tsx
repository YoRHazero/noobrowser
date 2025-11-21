import { Application } from "@pixi/react";
import { useRef } from "react";
import Viewport from "./Viewport";
import { Box } from "@chakra-ui/react";

export default function GrismForwardCanvas() {
    const parentRef = useRef<HTMLDivElement | null>(null);
    return (
        <Box
            ref={parentRef}
            height={"120px"}
        >
            <Application
                resizeTo={parentRef}
                backgroundColor={0x111111}
                resolution={1}
                antialias={true}
                autoDensity={true}
            >
                <Viewport passiveWheel={false}>
                    {/* Grism Forward Layers go here */}
                </Viewport>
            </Application>
        </Box>
    )
}