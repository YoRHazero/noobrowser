import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture } from "three";

export type RasterMaterialProps = ThreeElement<typeof ShaderMaterial> & {
	uTexture?: Texture;
	uColorMap?: Texture;
	uScalarKind?: number;
	uStretchKind?: number;
	uVmin?: number;
	uVmax?: number;
	uOpacity?: number;
};

const RasterMaterial = shaderMaterial(
	{
		uTexture: new Texture(),
		uColorMap: new Texture(),
		uScalarKind: 0,
		uStretchKind: 0,
		uVmin: 0,
		uVmax: 1,
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
		uniform sampler2D uColorMap;
		uniform float uScalarKind;
		uniform float uStretchKind;
		uniform float uVmin;
		uniform float uVmax;
		uniform float uOpacity;
		varying vec2 vUv;

		float decodeScalar(vec4 texel) {
			if (uScalarKind < 0.5) {
				return texel.r;
			}

			vec4 bytes = floor(texel * 255.0 + 0.5);
			if (uScalarKind < 1.5) {
				return bytes.r;
			}
			if (uScalarKind < 2.5) {
				return bytes.r + bytes.g * 256.0;
			}
			return bytes.r + bytes.g * 256.0 + bytes.b * 65536.0 + bytes.a * 16777216.0;
		}

		float normalizeLinear(float value, float minValue, float maxValue) {
			return (value - minValue) / max(maxValue - minValue, 1e-6);
		}

		float normalizeLog(float value, float minValue, float maxValue) {
			float start = max(minValue, 1e-6);
			float end = max(maxValue, start + 1e-6);
			float sampleValue = max(value, start);
			return (log(sampleValue) - log(start)) / max(log(end) - log(start), 1e-6);
		}

		float normalizeAsinh(float value, float minValue, float maxValue) {
			float linearValue = normalizeLinear(value, minValue, maxValue);
			return asinh(linearValue * 10.0) / asinh(10.0);
		}

		void main() {
			vec4 texel = texture2D(uTexture, vUv);
			float value = decodeScalar(texel);
			if (value != value) {
				discard;
			}

			float minValue = min(uVmin, uVmax);
			float maxValue = max(uVmin, uVmax);
			float clampedValue = clamp(value, minValue, maxValue);
			float normalized = 0.0;

			if (uStretchKind < 0.5) {
				normalized = normalizeLinear(clampedValue, minValue, maxValue);
			} else if (uStretchKind < 1.5) {
				normalized = sqrt(max(normalizeLinear(clampedValue, minValue, maxValue), 0.0));
			} else if (uStretchKind < 2.5) {
				normalized = normalizeLog(clampedValue, minValue, maxValue);
			} else {
				normalized = normalizeAsinh(clampedValue, minValue, maxValue);
			}

			vec4 mappedColor = texture2D(
				uColorMap,
				vec2(clamp(normalized, 0.0, 1.0), 0.5)
			);
			gl_FragColor = vec4(mappedColor.rgb, uOpacity);
		}
	`,
);

extend({ RasterMaterial });

export default RasterMaterial;
