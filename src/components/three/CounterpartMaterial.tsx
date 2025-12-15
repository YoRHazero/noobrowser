import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { Texture } from "three";

// 1. Define Shader Material
// The shaderMaterial helper creates a Three.js ShaderMaterial class automatically
const CounterpartMaterial = shaderMaterial(
    {
        uTexture: new Texture(), // Default texture
        uMode: 0,                // 0:RGB, 1:Red, 2:Green, 3:Blue
        uOpacity: 1.0,           // Opacity
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform sampler2D uTexture;
    uniform int uMode;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
        vec4 texColor = texture2D(uTexture, vUv);
        vec3 color = texColor.rgb;

        // Channel separation logic
        // If specific channel mode is selected, display that channel as grayscale
        if (uMode == 1) {
            color = vec3(texColor.r);
        } else if (uMode == 2) {
            color = vec3(texColor.g);
        } else if (uMode == 3) {
            color = vec3(texColor.b);
        }

        // Output color with opacity applied
        gl_FragColor = vec4(color, texColor.a * uOpacity);
    }
    `
);

// 2. Register with React Three Fiber
extend({ CounterpartMaterial });

export type CounterpartMaterialProps = ThreeElement<typeof CounterpartMaterial> & {
    uTexture?: Texture | null;
    uMode?: number;
    uOpacity?: number;
};

export default CounterpartMaterial;