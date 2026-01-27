import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture } from "three";

export type EmissionMaskMaterialProps = ThreeElement<typeof ShaderMaterial> & {
	uTexture?: Texture;
	uMaxValue?: number;
	uThreshold?: number;
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
	},
	// Vertex Shader
	`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
	// Fragment Shader with plasma colormap (more vibrant than viridis)
	`
    uniform sampler2D uTexture;
    uniform float uMaxValue;
    uniform float uThreshold;
    varying vec2 vUv;
    
    // Plasma colormap - more vibrant purple -> pink -> orange -> yellow
    vec3 plasma(float t) {
        const vec3 c0 = vec3(0.0504, 0.0298, 0.5280);
        const vec3 c1 = vec3(2.0281, -0.0893, 0.6900);
        const vec3 c2 = vec3(-2.3053, 3.5714, -2.0145);
        const vec3 c3 = vec3(6.8093, -6.0988, 3.1312);
        const vec3 c4 = vec3(-5.4094, 4.3636, -1.4507);
        const vec3 c5 = vec3(0.8394, -1.4310, 0.1674);
        
        return c0 + t * (c1 + t * (c2 + t * (c3 + t * (c4 + t * c5))));
    }
    
    void main() {
        float value = texture2D(uTexture, vUv).r * 255.0;
        
        // Discard pixels at or below threshold
        if (value <= uThreshold) discard;
        
        // Normalize to 0-1 range based on max value
        float t = clamp(value / uMaxValue, 0.0, 1.0);
        
        vec3 color = plasma(t);
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
