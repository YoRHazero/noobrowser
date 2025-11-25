import { type PixiReactElementProps } from "@pixi/react";
import { type Application } from "pixi.js";
import { PropsWithChildren } from "react";
/*
import { ViewportWrapper } from "@/components/pixi/Viewport";
import { FootprintContainer } from "@/features/footprint/FootprintManager";
import { GraticuleGraphics} from "@/components/pixi/GlobeGrid";
import { GlobeBackgroundGraphics } from "@/components/pixi/GlobeBackground";
*/
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        pixiViewportWrapper: PropsWithChildren<PixiReactElementProps<ViewportWrapper>> & {
          app: Application;
        };

        pixiFootprintContainer: PixiReactElementProps<FootprintContainer>;

        pixiGraticuleGraphics: PixiReactElementProps<GraticuleGraphics>;

        pixiGlobeBackgroundGraphics: PixiReactElementProps<GlobeBackgroundGraphics>;
      }
    }
  }
}