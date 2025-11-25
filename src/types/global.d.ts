import { type Viewport } from "@/components/pixi/Viewport";
import { type PixiReactElementProps } from "@pixi/react";
import { type Application } from "pixi.js";
import { PropsWithChildren } from "react";
import { FootprintManager } from "@/features/footprint/FootprintManager";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        pixiViewportWrapper: PropsWithChildren<PixiReactElementProps<ViewportWrapper>> & {
          app: Application;
        };

        pixiFootprintManager: PixiReactElementProps<FootprintManager>;
      }
    }
  }
}