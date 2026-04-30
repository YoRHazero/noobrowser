import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture } from "three";

export type BitmapReferenceMaterialProps = ThreeElement<
	typeof ShaderMaterial
> & {
	uTexture?: Texture;
	uMode?: number;
	uOpacity?: number;
};

const BitmapReferenceMaterial = shaderMaterial(
	{
		uTexture: new Texture(),
		uMode: 0,
		uOpacity: 1,
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
		uniform int uMode;
		uniform float uOpacity;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D(uTexture, vUv);
			vec3 color = texel.rgb;

			if (uMode == 1) {
				color = vec3(texel.r);
			} else if (uMode == 2) {
				color = vec3(texel.g);
			} else if (uMode == 3) {
				color = vec3(texel.b);
			}

			gl_FragColor = vec4(color, texel.a * uOpacity);
		}
	`,
);

extend({ BitmapReferenceMaterial });

export default BitmapReferenceMaterial;
