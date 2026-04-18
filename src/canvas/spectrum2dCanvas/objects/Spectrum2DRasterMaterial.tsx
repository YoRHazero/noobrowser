import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { type ShaderMaterial, Texture } from "three";

export type Spectrum2DRasterMaterialProps = ThreeElement<
	typeof ShaderMaterial
> & {
	uRaster?: Texture;
	uColorMap?: Texture;
	uNormKind?: number;
	uNormMin?: number;
	uNormMax?: number;
	uLogFloor?: number;
	uAsinhSoftness?: number;
};

const Spectrum2DRasterMaterial = shaderMaterial(
	{
		uRaster: new Texture(),
		uColorMap: new Texture(),
		uNormKind: 0,
		uNormMin: 0,
		uNormMax: 1,
		uLogFloor: 1e-6,
		uAsinhSoftness: 1,
	},
	`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	`
		uniform sampler2D uRaster;
		uniform sampler2D uColorMap;
		uniform float uNormKind;
		uniform float uNormMin;
		uniform float uNormMax;
		uniform float uLogFloor;
		uniform float uAsinhSoftness;
		varying vec2 vUv;

		float normalizeLinear(float value, float minValue, float maxValue) {
			return (value - minValue) / max(maxValue - minValue, 1e-6);
		}

		float normalizeLog(float value, float minValue, float maxValue) {
			float start = max(minValue, max(uLogFloor, 1e-6));
			float end = max(maxValue, start + 1e-6);
			float sampleValue = max(value, start);
			return (log(sampleValue) - log(start)) / max(log(end) - log(start), 1e-6);
		}

		float normalizeAsinh(float value, float minValue, float maxValue) {
			float softness = max(uAsinhSoftness, 1e-6);
			float numerator = asinh((value - minValue) / softness);
			float denominator = max(asinh((maxValue - minValue) / softness), 1e-6);
			return numerator / denominator;
		}

		void main() {
			float value = texture2D(uRaster, vUv).r;
			if (value != value) {
				gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
				return;
			}

			float minValue = min(uNormMin, uNormMax);
			float maxValue = max(uNormMin, uNormMax);
			float clampedValue = clamp(value, minValue, maxValue);
			float normalized = 0.0;

			if (uNormKind < 0.5) {
				normalized = normalizeLinear(clampedValue, minValue, maxValue);
			} else if (uNormKind < 1.5) {
				normalized = normalizeLog(clampedValue, minValue, maxValue);
			} else {
				normalized = normalizeAsinh(clampedValue, minValue, maxValue);
			}

			vec4 mappedColor = texture2D(
				uColorMap,
				vec2(clamp(normalized, 0.0, 1.0), 0.5)
			);
			gl_FragColor = vec4(mappedColor.rgb, 1.0);
		}
	`,
);

extend({ Spectrum2DRasterMaterial });

export default Spectrum2DRasterMaterial;
