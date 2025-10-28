import { useRef } from "react";
import { Application, extend } from "@pixi/react";
import { Box } from "@chakra-ui/react";
import { Container } from "pixi.js";
import GlobeViewport from './GlobeViewport'
import FootprintTooltip from "./FootprintTooltip";

extend({
  Container,
});

export default function FootprintCanvas( {children}: {children: React.ReactNode} ) {
    const parentRef = useRef<HTMLDivElement | null>(null);
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
                </GlobeViewport>
            </Application>
            <FootprintTooltip />
        </Box>
    )
}