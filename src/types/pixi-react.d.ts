import { type Viewport } from 'pixi-viewport';
import { type PixiReactElementProps } from '@pixi/react';
import { RenderLayer } from 'pixi.js';

declare module '@pixi/react'
{
    interface PixiElements
    {
        pixiViewport: PixiReactElementProps<typeof Viewport>;
    }
}

export type RenderLayerInstance = InstanceType<typeof RenderLayer>;