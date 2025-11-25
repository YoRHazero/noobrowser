import { useEffect, useRef } from "react";
import { Application, extend } from "@pixi/react";
import { Box } from "@chakra-ui/react";
import { Container, RenderLayer } from "pixi.js";

import type { RenderLayerInstance } from "@/types/pixi-react";
import { useGlobeStore } from "@/stores/footprints";
import GlobeViewport from '@/components/pixi/GlobeViewport'
import FootprintTooltip from "@/features/footprint/FootprintTooltip";
import GlobeGrid from "@/components/pixi/GlobeGrid";
import FootprintManager from "./FootprintManager";
import GlobeBackground from "@/components/pixi/GlobeBackground";
import { useQueryAxiosGet } from "@/hook/connection-hook";

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
    const setFootprints = useGlobeStore((state) => state.setFootprints);
    const footprintQuery = useQueryAxiosGet({
        queryKey: ['grism_footprints'],
        path: '/overview/grism_footprints',
    });
    useEffect(() => {
        if (!footprintQuery.isSuccess) return;
        const footprintData = footprintQuery.data;
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
        >
            <Application
                resizeTo={parentRef}
                backgroundColor={0xffffff}
                resolution={1}
                antialias={true}
                autoDensity={true}
            >
                <GlobeViewport>
                    <pixiRenderLayer ref={backgroundRef} sortableChildren={true} />
                    <pixiRenderLayer ref={worldLayerRef} sortableChildren={true} />
                    <FootprintManager 
                        layerRef={worldLayerRef} 
                    />
                    <GlobeGrid layerRef={backgroundRef} />
                    <GlobeBackground layerRef={backgroundRef} />
                    <FootprintTooltip />
                </GlobeViewport>
            </Application>
        </Box>
    )
}