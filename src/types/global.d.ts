import { type CustomGlobeViewport } from '@/components/pixi/GlobeViewport';
import { type Viewport } from "@/components/pixi/Viewport";
import { type PixiReactElementProps } from "@pixi/react";
import { type Application } from "pixi.js";
import { PropsWithChildren } from "react";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends PixiElements {
        pixiCustomGlobeViewport: PropsWithChildren<PixiReactElementProps<CustomGlobeViewport>> & {
          app: Application;
        };
        pixiViewportWrapper: PropsWithChildren<PixiReactElementProps<ViewportWrapper>> & {
          app: Application;
        };
      }
    }
  }
}