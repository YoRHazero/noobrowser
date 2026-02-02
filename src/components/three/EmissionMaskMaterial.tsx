import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture } from "three";

export type EmissionMaskMaterialProps = ThreeElement<typeof ShaderMaterial> & {
	uTexture?: Texture;
	uMaxValue?: number;
	uThreshold?: number;
	uPalette?: Texture;
	uPaletteSize?: number;
	uMaskFormat?: number; // 0=uint8, 1=uint16, 2=uint32
	uVisibleBitmask?: number;
	uOpacity?: number;
};

/**
 * Emission Mask Shader
 * Supports decoding uint8/16/32 data from textures and applying bitmask visibility.
 */
const EmissionMaskMaterial = shaderMaterial(
	{
		uTexture: new Texture(),
		uMaxValue: 1.0,
		uThreshold: 0.0,
		uPalette: new Texture(),
		uPaletteSize: 1.0,
		uMaskFormat: 0,
		uVisibleBitmask: 0xffffffff,
		uOpacity: 0.85,
	},
	// Vertex Shader
	`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
	// Fragment Shader with discrete colormap & bitmask support
	`
    uniform sampler2D uTexture;
    uniform sampler2D uPalette;
    uniform float uMaxValue;
    uniform float uThreshold;
    uniform float uPaletteSize;
    uniform int uMaskFormat; // 0=uint8, 1=uint16, 2=uint32
    uniform int uVisibleBitmask; // Signed int for check
    uniform float uOpacity;
    
    varying vec2 vUv;
    
    // Helper to count set bits (Hamming weight)
    int countSetBits(int n) {
        int count = 0;
        for (int i = 0; i < 32; i++) {
            if ((n & (1 << i)) != 0) count++;
        }
        return count;
    }
    
    void main() {
        // Read raw value from texture
        // Reconstruct integer value based on format
        int maskValue = 0;
        vec4 tex = texture2D(uTexture, vUv);
        
        if (uMaskFormat == 2) { // uint32 (RGBA)
            // Bytes are mapped to channels. 
            // R=Byte0, G=Byte1, B=Byte2, A=Byte3
            int b0 = int(tex.r * 255.0 + 0.5);
            int b1 = int(tex.g * 255.0 + 0.5);
            int b2 = int(tex.b * 255.0 + 0.5);
            int b3 = int(tex.a * 255.0 + 0.5);
            maskValue = b0 | (b1 << 8) | (b2 << 16) | (b3 << 24);
        } else if (uMaskFormat == 1) { // uint16 (RG or Red/Green split?) -> Assumed RG from layer
             // We decided to use standard UnsignedByteType data texture in layer.
             // If we packed uint16 into RG:
            int b0 = int(tex.r * 255.0 + 0.5);
            int b1 = int(tex.g * 255.0 + 0.5);
            maskValue = b0 | (b1 << 8);
        } else { // uint8 (Red/Luminance)
            maskValue = int(tex.r * 255.0 + 0.5);
        }
        
        // Apply visibility mask 
        int visibleMask = maskValue & uVisibleBitmask;
        
        if (visibleMask == 0) discard;
        
        // Count overlapping frames
        int overlapCount = countSetBits(visibleMask);
        
        // Filter by threshold (uThreshold is float, usually int-like 0..N)
        // If count <= threshold, discard.
        // e.g. threshold 0 shows everything (count >= 1).
        // threshold 1 shows count >= 2.
        if (float(overlapCount) <= uThreshold) discard;
        
        // If overlapCount is 0, it's caught by above if threshold >= 0.
        // But if threshold is negative (unlikely), overlapCount 0 might pass?
        // Safe check:
        if (overlapCount == 0) discard;
        
        // Map to palette color
        // overlapCount 1 -> Index 0 in palette? 
        // User logic: "map value to palette index. Value starts at 1, so subtract 1."
        // New logic: count is the value.
        float idx = mod(float(overlapCount) - 1.0, uPaletteSize);
        vec2 puv = vec2((idx + 0.5) / uPaletteSize, 0.5);
        vec3 color = texture2D(uPalette, puv).rgb;
        
        gl_FragColor = vec4(color, uOpacity);
    }
    `,
);

// Note: We need to pass uVisibleBitmask as uVisibleBitmaskInt because R3F usually binds numbers as floats/ints
// We will simply map bitmask to signed int in js if needed, or rely on 32-bit int casting.
// 0xFFFFFFFF in JS is 4294967295. In 32-bit signed int, it's -1.
// Passing 4294967295 to uniform1i works in WebGL2? 
// Safer: In usage component, we cast to Int32Array([mask])[0].

extend({ EmissionMaskMaterial });

declare module "@react-three/fiber" {
	interface ThreeElements {
		emissionMaskMaterial: EmissionMaskMaterialProps;
	}
}

export default EmissionMaskMaterial;
