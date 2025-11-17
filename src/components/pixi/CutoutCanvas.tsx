import { useRef } from "react";
import { Application, extend } from "@pixi/react";
import { Box } from "@chakra-ui/react";
import { Container, RenderLayer } from "pixi.js";

import Viewport from "./Viewport";
import type { RenderLayerInstance } from "@/types/pixi-react";
import CutoutImage from "./CutoutImage";
extend({
    Container,
    RenderLayer,
});
export default function CutoutCanvas() {
    const parentRef = useRef<HTMLDivElement | null>(null);
    return (
        <Box
            ref={parentRef}
            width={"600px"}
            height={"600px"}
            border={"1px solid black"}
        >
            <Application
                resizeTo={parentRef}
                backgroundColor={0xffffff}
                resolution={1}
                antialias={true}
                autoDensity={true}
            >
                <Viewport passiveWheel={false}>
                    <CutoutImage />
                </Viewport>
            </Application>
        </Box>
    )
}