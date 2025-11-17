import { 
    Texture,
    Sprite,
} from "pixi.js";
import { extend } from "@pixi/react";
import { useRef, useEffect, useState } from "react";
import { useCounterpartStore } from "@/stores/image";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartCutout } from "@/hook/connection-hook";
import { textureFromNormData } from "@/utils/plot";

extend({
    Sprite,
});

export default function CutoutImage() {
    const spriteRef = useRef<Sprite | null>(null);
    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const selectedFootprintId = useGlobeStore((s) => s.selectedFootprintId);
    const filterRGB = useCounterpartStore((s) => s.filterRGB);
    const { data: cutoutData } = useCounterpartCutout(
        selectedFootprintId,
        filterRGB.r,
        cutoutParams,
        false
    );
    const [cutoutTexture, setCutoutTexture] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (!cutoutData) return;
        const texture = textureFromNormData(
            cutoutData.cutout_data,
            cutoutParams.width,
            cutoutParams.height,
            cutoutParams.cutoutPmin,
            cutoutParams.cutoutPmax
        );
        setCutoutTexture(texture);
        return () => {
            if (texture !== Texture.EMPTY) {
                texture.destroy(true);
            }
        };
    }, [cutoutData, cutoutParams.width, cutoutParams.height, cutoutParams.cutoutPmin, cutoutParams.cutoutPmax]);
    return (
        cutoutTexture !== Texture.EMPTY && (
            <pixiSprite
                ref={spriteRef}
                texture={cutoutTexture}
                x={0}
                y={0}
                width={cutoutParams.width}
                height={cutoutParams.height}
            />
        )
    )
}