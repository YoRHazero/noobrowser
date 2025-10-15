import { type CustomGlobeViewport } from '@/components/pixi/GlobeViewport';
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
      }
    }
  }
}