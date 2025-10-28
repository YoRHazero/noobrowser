import { useRef } from "react";
import { Application, extend } from "@pixi/react";
import { Box, Button } from "@chakra-ui/react";
import { Container } from "pixi.js";
import GlobeViewport from './GlobeViewport'
import FootprintTooltip from "./FootprintTooltip";
import { useGlobeStore } from "@/stores/footprints";
extend({
  Container,
});

export default function FootprintCanvas( {children}: {children: React.ReactNode} ) {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const setView = useGlobeStore((state) => state.setView);
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
                    {children}
                    <FootprintTooltip />
                </GlobeViewport>
            </Application>
            <Button
                size="sm"
                position="absolute"
                top="8px"
                right="8px"
                onClick={() => setView({ yawDeg: 0, pitchDeg: 0, scale: 1 })}
            >
                Reset View
            </Button>
        </Box>
    )
}