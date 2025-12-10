import { extend, type ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { Color, Texture, ShaderMaterial } from 'three';
export type GrismMaterialProps = ThreeElement<typeof ShaderMaterial> & {
    uTexture?: Texture;
    uVmin?: number;
    uVmax?: number;
    uColor?: Color | string;
}

const GrismMaterial = shaderMaterial(
    {
        uTexture: new Texture(),
        uVmin: 0.0,
        uVmax: 1.0,
    },
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform sampler2D uTexture;
    uniform float uVmin;
    uniform float uVmax;
    varying vec2 vUv;
    
    void main() {
        float value = texture2D(uTexture, vUv).r;

        float normalized = (value - uVmin) / (uVmax - uVmin);
        normalized = clamp(normalized, 0.0, 1.0);

        gl_FragColor = vec4(vec3(normalized), 1.0);
    }
    `
);
extend({ GrismMaterial });

export default GrismMaterial;