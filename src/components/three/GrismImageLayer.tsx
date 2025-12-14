import { memo, useMemo, useRef } from "react";
import { DataTexture, NearestFilter, RedFormat, HalfFloatType, ClampToEdgeWrapping } from "three";
import { useFrame } from "@react-three/fiber";
import GrismMaterial from "@/components/three/GrismMaterial";
type GrismMaterialType = InstanceType<typeof GrismMaterial>;
const GrismImageLayer = memo(function GrismImageLayer({
    buffer,
    width,
    height,
    dx,
    dy,
    vmin,
    vmax,
    isVisible,
}: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
    dx: number;
    dy: number;
    vmin: number;
    vmax: number;
    isVisible: boolean;
}) {
    const materialRef = useRef<GrismMaterialType>(null);
    const texture = useMemo(() => {
        const dataView = new Uint16Array(buffer);
        const textureInThree = new DataTexture(
            dataView,
            width,
            height,
            RedFormat,
            HalfFloatType
        );
        textureInThree.minFilter = NearestFilter;
        textureInThree.magFilter = NearestFilter;
        textureInThree.wrapS = ClampToEdgeWrapping;
        textureInThree.wrapT = ClampToEdgeWrapping;
        textureInThree.flipY = true;
        textureInThree.needsUpdate = true;
        return textureInThree;
    }, [buffer, width, height]);

    useFrame(() => {
        if (materialRef.current) {
            // Update material properties or perform animations here
            materialRef.current.uniforms.uVmin.value = vmin;
            materialRef.current.uniforms.uVmax.value = vmax;
        }
    })
    if (!isVisible) {
        return null;
    }
    return (
        <mesh position={[dx, -dy, 0]}>
            <planeGeometry args={[width, height]} />
            <grismMaterial
                ref={materialRef}
                uTexture={texture}
            />
        </mesh>
    );
})
export default GrismImageLayer;