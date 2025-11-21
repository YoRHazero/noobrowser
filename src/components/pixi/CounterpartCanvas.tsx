import { useRef } from "react";
import { Application, extend } from "@pixi/react";
import { Box } from "@chakra-ui/react";
import { Container, RenderLayer, Graphics } from "pixi.js";

import Viewport from "./Viewport";
import CounterpartImageLayer from "./CounterpartImageLayer";
import CutoutLayer from "./CutoutLayer";
import type { RenderLayerInstance } from "@/types/pixi-react";
extend({
    Container,
    RenderLayer,
    Graphics,
});

export default function CounterpartCanvas() {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const imageLayerRef = useRef<RenderLayerInstance | null>(null);
    const cutoutLayerRef = useRef<RenderLayerInstance | null>(null);
    return (
        <Box
            ref={parentRef}
            width={"600px"}
            height={"600px"}
            border={"1px solid black"}
        >
            <Application
                resizeTo={parentRef}
                backgroundColor={0x111111}
                resolution={1}
                antialias={true}
                autoDensity={true}
            >
                <Viewport passiveWheel={false}>
                    <CounterpartImageLayer layerRef={imageLayerRef} />
                    <CutoutLayer layerRef={cutoutLayerRef} />
                </Viewport>
            </Application>
        </Box>
    )
}