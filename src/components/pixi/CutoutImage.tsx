import { 
    Texture,
    Sprite,
} from "pixi.js";
import { extend, useApplication } from "@pixi/react";
import { useRef, useEffect, useState } from "react";
import { useCounterpartStore } from "@/stores/image";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartCutout } from "@/hook/connection-hook";
import { sort2DArray } from "@/utils/plot";
import textureFromData from "@/utils/plot";

extend({
    Sprite,
});

export default function CutoutImage() {
    const spriteRef = useRef<Sprite | null>(null);
    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const selectedFootprintId = useGlobeStore((s) => s.selectedFootprintId);
    const filterRGB = useCounterpartStore((s) => s.filterRGB);
    const { data: cutoutData } = useCounterpartCutout({
        selectedFootprintId,
        filter: filterRGB.r,
        cutoutParams,
        enabled: false,
    });
    const [sortedCutoutData, setSortedCutoutData] = useState<number[] | null>(null);
    // Sort cutout data when it changes
    useEffect(() => {
        if (!cutoutData) {
            setSortedCutoutData(null);
            return;
        }
        const sortedData = sort2DArray(cutoutData.cutout_data);
        setSortedCutoutData(sortedData);
    }, [cutoutData]);

    const [cutoutTexture, setCutoutTexture] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (!cutoutData || !sortedCutoutData) return;
        const texture = textureFromData({
            data: cutoutData.cutout_data,
            width: cutoutParams.width,
            height: cutoutParams.height,
            pmin: cutoutParams.cutoutPmin,
            pmax: cutoutParams.cutoutPmax,
            sortedArray: sortedCutoutData,
            excludeZero: true,
        });
        setCutoutTexture((prev) => {
            if (prev && !prev.destroyed) {
                prev.destroy(true);
            }
            return texture;
        });
    }, [cutoutData, cutoutParams.width, cutoutParams.height, cutoutParams.cutoutPmin, cutoutParams.cutoutPmax]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setCutoutTexture((prev) => {
                if (prev && !prev.destroyed) {
                    prev.destroy(true);
                }
                return Texture.EMPTY;
            })
        }
    }, []);

    const { app } = useApplication();
    if (!app.renderer) {
        return null;
    }
    const screenWidth = app.renderer.width;
    const screenHeight = app.renderer.height;
    const imageWidth = cutoutParams.width;
    const imageHeight = cutoutParams.height;

    const scale = Math.min(screenWidth / imageWidth, screenHeight / imageHeight);
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    return (
        cutoutTexture !== Texture.EMPTY && (
            <pixiSprite
                ref={spriteRef}
                texture={cutoutTexture}
                anchor={0.5}
                x={centerX}
                y={centerY}
                scale={scale}
            />
        )
    )
}