import "@/components/three/EmissionMaskMaterial";
import { useEffect, useMemo } from "react";

import {
	ClampToEdgeWrapping,
	Color,
	DataTexture,
	DoubleSide,
	LinearFilter,
	RedFormat,
	RGBAFormat,
	UnsignedByteType,
} from "three";

import { useGlobeStore } from "@/stores/footprints";
import { useEmissionMaskLayer } from "./hooks/useEmissionMaskLayer";

export const EMISSION_MASK_COLORS = [
	"#e6194b",
	"#3cb44b",
	"#ffe119",
	"#4363d8",
	"#f58231",
	"#911eb4",
	"#46f0f0",
	"#f032e6",
	"#bcf60c",
	"#fabebe",
	"#008080",
	"#e6beff",
	"#9a6324",
	"#fffac8",
	"#800000",
	"#aaffc3",
	"#808000",
	"#ffd8b1",
	"#000075",
	"#808080",
];









export default function EmissionMaskLayer({
	meshZ = 0.1,
	currentBasename,
}: {
	meshZ?: number;
	currentBasename?: string;
} = {}) {
	const {
		isVisible,
		maskData,
		threshold,
		mode,
	} = useEmissionMaskLayer();



	// Determine current frame index using footprint metadata
	const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
	const footprints = useGlobeStore((state) => state.footprints);
	
	const currentFrameIndex = useMemo(() => {
		if (!currentBasename || !selectedFootprintId) return -1;
		
		const footprint = footprints.find(f => f.id === selectedFootprintId);
		if (!footprint?.meta?.included_files) return -1;
		
		// "basename list order in a group matches backend group_box order"
		// The `included_files` list should match the backend order if source of truth.
		// Verifying: included_files usually comes from backend list.
		return footprint.meta.included_files.indexOf(currentBasename);
	}, [currentBasename, selectedFootprintId, footprints]);

	// Create shared palette texture
	const paletteTexture = useMemo(() => {
		const width = EMISSION_MASK_COLORS.length;
		const height = 1;
		const size = width * height;
		const data = new Uint8Array(4 * size);

		EMISSION_MASK_COLORS.forEach((hex, i) => {
			const c = new Color(hex);
			data[i * 4] = Math.floor(c.r * 255);
			data[i * 4 + 1] = Math.floor(c.g * 255);
			data[i * 4 + 2] = Math.floor(c.b * 255);
			data[i * 4 + 3] = 255;
		});

		const tex = new DataTexture(data, width, height);
		tex.needsUpdate = true;
		return tex;
	}, []);



	// Cleanup palette texture on unmount
	useEffect(() => {
		return () => {
			paletteTexture.dispose();
		};
	}, [paletteTexture]);

	// Creating texture
	const texture = useMemo(() => {
		if (!maskData) return null;
		const { buffer, width, height, format } = maskData;
		let dataTexture: DataTexture;

		// We treat everything as UnsignedByteType data.
		// If uint32, we have RGBA (4 bytes).
		// If uint8, we have Red (1 byte) - BUT for Bitwise shader, passing as RGBA/RedInteger is tricky in Three R3F.
		// Safer approach: Treat all as RGBA UnsignedByteType (if alignment works) or RedFormat.
		// uint32 buffer naturally maps to RGBA bytes.
		// uint8 buffer maps to Red bytes.
		
		if (format === 'uint32') {
			// buffer is 4 * w * h bytes.
			const uint8View = new Uint8Array(buffer);
			// Create RGBA texture.
			// Note: Little Endian: ABGR vs RGBA?
			// WebGL reads bytes: Byte 0 -> R, Byte 1 -> G...
			// uint32 (LE): Byte 0 is LSB.
			// So R channel corresponds to Bits 0-7.
			// This is perfect.
			dataTexture = new DataTexture(uint8View, width, height, RGBAFormat, UnsignedByteType);
		} else if (format === 'uint16') {
			// buffer is 2 * w * h bytes.
			// We can pad to RGBA or use RGFormat if supported (WebGL2).
			// Let's try RGFormat (Red=Bits 0-7, Green=Bits 8-15).
			// If RGFormat not available in types (it is in Three), good.
			// However, safe fallback is RedFormat for uint8.
			// For uint16, ThreeJS RGFormat with UnsignedByteType expects 2 bytes per pixel.
			const uint8View = new Uint8Array(buffer);
			// @ts-ignore - RGFormat exists in Three but sometimes types issue
			dataTexture = new DataTexture(uint8View, width, height, 1023 /* RGFormat */, UnsignedByteType);
		} else {
			// uint8
			const uint8View = new Uint8Array(buffer);
			dataTexture = new DataTexture(uint8View, width, height, RedFormat, UnsignedByteType);
		}
		
		dataTexture.minFilter = LinearFilter;
		dataTexture.magFilter = LinearFilter; // Nearest might be better for bitmask?
		// Actually for bitmask, NEAREST is mandatory to avoid interpolating bits (e.g. 1 and 2 becoming 1.5 which is nonsense bits)
		// Wait, if we use float-like interpolation on bitmasks, we get garbage.
		// MUST USE NEAREST FILTER.
		dataTexture.minFilter = 1003; // NearestFilter
		dataTexture.magFilter = 1003; // NearestFilter
		dataTexture.wrapS = ClampToEdgeWrapping;
		dataTexture.wrapT = ClampToEdgeWrapping;
		dataTexture.flipY = true;
		dataTexture.needsUpdate = true;
		return dataTexture;
	}, [maskData]);

	// Cleanup texture when it changes or unmounts
	useEffect(() => {
		return () => {
			texture?.dispose();
		};
	}, [texture]);


	if (!isVisible || !maskData || !texture) return null;

	const { xStart, yStart, width, height, maxValue, format } = maskData;





	// Position the mesh based on mask bounds
	const meshX = xStart + width / 2;
	const meshY = -(yStart + height / 2);
	return (
		<>
			{/* Heatmap layer */}
			<mesh position={[meshX, meshY, meshZ]}>
				<planeGeometry args={[width, height]} />
				<emissionMaskMaterial
					uTexture={texture}
					uMaxValue={maxValue}
					uThreshold={threshold}
					uPalette={paletteTexture}
					uPaletteSize={EMISSION_MASK_COLORS.length}
					uMaskFormat={format === 'uint32' ? 2 : format === 'uint16' ? 1 : 0}
					uVisibleBitmask={
						mode === 'total' 
							? 0xFFFFFFFF 
							: (mode === 'individual' && currentFrameIndex >= 0)
								? (1 << currentFrameIndex) 
								: 0
					}
					uOpacity={mode === 'individual' ? 1.0 : 0.85}
					transparent={true}
					side={DoubleSide}
					depthWrite={false}
				/>
			</mesh>


		</>
	);
}
