import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture } from "three";

export type EmissionMaskMaterialProps = ThreeElement<typeof ShaderMaterial> & {
	uTexture?: Texture;
	uMaxValue?: number;
	uThreshold?: number;
	uPalette?: Texture;
	uPaletteSize?: number;
};

/**
 * Viridis colormap implementation in GLSL
 * Values below threshold are discarded (fully transparent)
 */
const EmissionMaskMaterial = shaderMaterial(
	{
		uTexture: new Texture(),
		uMaxValue: 1.0,
		uThreshold: 0.0,
		uPalette: new Texture(),
		uPaletteSize: 1.0,
	},
	// Vertex Shader
	`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
	// Fragment Shader with discrete colormap
	`
    uniform sampler2D uTexture;
    uniform sampler2D uPalette;
    uniform float uMaxValue;
    uniform float uThreshold;
    uniform float uPaletteSize;
    varying vec2 vUv;
    
    void main() {
        float value = texture2D(uTexture, vUv).r * 255.0;
        
        // Discard pixels at or below threshold
        if (value <= uThreshold) discard;
        
        // Discrete color lookup
        // Map value to palette index. Value starts at 1, so subtract 1.
        // Wrap around if value exceeds palette size using mod.
        float idx = mod(value - 1.0, uPaletteSize);
        
        // Sample from center of the texel
        vec2 puv = vec2((idx + 0.5) / uPaletteSize, 0.5);
        vec3 color = texture2D(uPalette, puv).rgb;
        
        gl_FragColor = vec4(color, 0.85);
    }
    `,
);

extend({ EmissionMaskMaterial });

declare module "@react-three/fiber" {
	interface ThreeElements {
		emissionMaskMaterial: EmissionMaskMaterialProps;
	}
}

export default EmissionMaskMaterial;
