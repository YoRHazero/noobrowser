import { Application } from "@pixi/react";
import { useRef } from "react";
import Viewport from "@/components/pixi/Viewport";
import { Box } from "@chakra-ui/react";
import { ViewportWrapper } from "@/components/pixi/Viewport";

import GrismForwardImage from "@/features/grism/GrismForwardImage";
export default function GrismForwardCanvas() {
    const parentRef = useRef<HTMLDivElement | null>(null);
    return (
        <Box
            ref={parentRef}
            height={"120px"}
            w={900}
            border={"1px solid black"}
        >
            <Application
                resizeTo={parentRef}
                backgroundColor={0xf2f2f2}
                resolution={1}
                antialias={true}
                autoDensity={true}
            >
                <Viewport passiveWheel={false}>
                    <GrismForwardImage />
                </Viewport>
            </Application>
        </Box>
    )
}