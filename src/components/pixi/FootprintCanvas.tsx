import { useEffect, useRef } from "react";
import { Application, extend } from "@pixi/react";
import { Box } from "@chakra-ui/react";
import { Container, RenderLayer } from "pixi.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import type { RenderLayerInstance } from "@/types/pixi-react";
import { useGlobeStore } from "@/stores/footprints";
import { useConnectionStore } from "@/stores/connection";
import GlobeViewport from './GlobeViewport'
import FootprintTooltip from "./FootprintTooltip";
import FootprintGraphics from "./FootprintGraphics";
import GlobeBackground from "./GlobeBackground";
import FootprintToolkit from "./FootprintToolkit";

extend({
  Container,
  RenderLayer,
});

export default function FootprintCanvas() {
    // Render Layers
    const parentRef = useRef<HTMLDivElement | null>(null);
    const worldLayerRef = useRef<RenderLayerInstance | null>(null);
    const backgroundRef = useRef<RenderLayerInstance | null>(null);


    const setBackground = useGlobeStore((state) => state.setGlobeBackground);
    // Consistent with Box size below
    setBackground({
        centerX: 400,
        centerY: 300,
        initialRadius: Math.min(800, 600) / 2 * 0.9
    });

    // Footprint Query
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const setFootprints = useGlobeStore((state) => state.setFootprints);
    const footprintQuery = useQuery({
        queryKey: ['grism_footprints'],
        queryFn: () => axios.get(
            backendUrl + '/overview/grism_footprints',
        ),
        enabled: !!backendUrl,
    });
    useEffect(() => {
        if (!footprintQuery.isSuccess) return;
        const footprintData = footprintQuery.data.data;
        const footprints = footprintData.map((fp: any) => ({
            id: fp.id,
            vertices: fp.footprint.vertices.map((v: number[]) => ({ ra: v[0], dec: v[1] })),
            meta: { ...fp.meta, center: { ra: fp.footprint.center[0], dec: fp.footprint.center[1] } },
        }));
        setFootprints(footprints);
    }, [footprintQuery.data, footprintQuery.isSuccess, setFootprints]);
    return (
        <Box 
            ref={parentRef}
            width={"800px"}
            height={"600px"}
            border={"1px solid black"}
            position={"relative"}
        >
            <Application
                resizeTo={parentRef}
                backgroundColor={0xffffff}
                resolution={1}
                antialias={true}
                autoDensity={true}
            >
                <GlobeViewport>
                    <pixiRenderLayer ref={backgroundRef} />
                    <pixiRenderLayer ref={worldLayerRef} />
                    <FootprintGraphics 
                        layerRef={worldLayerRef} 
                    />
                    <GlobeBackground layerRef={worldLayerRef} />
                    <FootprintTooltip />
                </GlobeViewport>
            </Application>
            <Box
                position="absolute"
                top="8px"
                right="8px"
            >
                <FootprintToolkit />
            </Box>
        </Box>
    )
}