import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture, Vector4 } from "three";
import { IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES } from "../shared/constants";

export type MaskMaterialProps = ThreeElement<typeof ShaderMaterial> & {
	uTexture?: Texture;
	uMaskCount?: number;
	uMaskValueBytes?: Vector4[];
	uMaskColors?: Vector4[];
	uOpacity?: number;
};

const EMPTY_MASK_VALUES = Array.from(
	{ length: IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES },
	() => new Vector4(0, 0, 0, 0),
);

const EMPTY_MASK_COLORS = Array.from(
	{ length: IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES },
	() => new Vector4(0, 0, 0, 0),
);

const MaskMaterial = shaderMaterial(
	{
		uTexture: new Texture(),
		uMaskCount: 0,
		uMaskValueBytes: EMPTY_MASK_VALUES,
		uMaskColors: EMPTY_MASK_COLORS,
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
		const int MAX_MASK_MAP_ENTRIES = 32;
		uniform sampler2D uTexture;
		uniform int uMaskCount;
		uniform vec4 uMaskValueBytes[MAX_MASK_MAP_ENTRIES];
		uniform vec4 uMaskColors[MAX_MASK_MAP_ENTRIES];
		uniform float uOpacity;
		varying vec2 vUv;

		bool sameBytes(vec4 a, vec4 b) {
			vec4 delta = abs(a - b);
			return delta.r < 0.5 && delta.g < 0.5 && delta.b < 0.5 && delta.a < 0.5;
		}

		void main() {
			vec4 texel = texture2D(uTexture, vUv);
			vec4 sampleBytes = floor(texel * 255.0 + 0.5);

			for (int index = 0; index < MAX_MASK_MAP_ENTRIES; index++) {
				if (index < uMaskCount && sameBytes(sampleBytes, uMaskValueBytes[index])) {
					vec4 color = uMaskColors[index];
					gl_FragColor = vec4(color.rgb, color.a * uOpacity);
					return;
				}
			}

			discard;
		}
	`,
);

extend({ MaskMaterial });

export default MaskMaterial;
