import { useEffect, useMemo, useRef } from "react";
import {
	ClampToEdgeWrapping,
	DataTexture,
	FloatType,
	HalfFloatType,
	LinearFilter,
	LinearSRGBColorSpace,
	type MagnificationTextureFilter,
	type MinificationTextureFilter,
	NearestFilter,
	NoColorSpace,
	RedFormat,
	RGBAFormat,
	SRGBColorSpace,
	Texture,
	UnsignedByteType,
} from "three";
import type { Frame, Model, ScalarData } from "../api";
import type {
	ImageCanvasLayerRole,
	ImageCanvasTexturePart,
} from "../shared/types";
import {
	getModelRetainTextureKeys,
	getTextureCacheKey,
	isScalarDataValid,
} from "../utils";

export interface ImageTextureCache {
	getTexture: (
		layer: ImageCanvasLayerRole,
		part: ImageCanvasTexturePart,
		frame: Frame,
		filter: "linear" | "nearest",
	) => Texture | null;
}

function configureTexture(
	texture: Texture,
	filter: MinificationTextureFilter | MagnificationTextureFilter,
): void {
	texture.minFilter = filter as MinificationTextureFilter;
	texture.magFilter = filter as MagnificationTextureFilter;
	texture.wrapS = ClampToEdgeWrapping;
	texture.wrapT = ClampToEdgeWrapping;
	texture.flipY = false;
	texture.generateMipmaps = false;
	texture.needsUpdate = true;
}

function packIntegerScalarToRgba(
	data: ScalarData,
	sampleCount: number,
): Uint8Array {
	const packed = new Uint8Array(sampleCount * 4);

	for (let index = 0; index < sampleCount; index += 1) {
		const offset = index * 4;
		const value = Math.trunc(data.array[index] ?? 0) >>> 0;
		packed[offset] = value & 0xff;
		packed[offset + 1] = (value >>> 8) & 0xff;
		packed[offset + 2] = (value >>> 16) & 0xff;
		packed[offset + 3] = (value >>> 24) & 0xff;
	}

	return packed;
}

function createScalarTexture(
	data: ScalarData,
	width: number,
	height: number,
	filter: "linear" | "nearest",
): DataTexture | null {
	const sampleCount = Math.max(1, width * height);
	if (!isScalarDataValid(data, sampleCount)) {
		return null;
	}

	const textureFilter = filter === "nearest" ? NearestFilter : LinearFilter;
	let texture: DataTexture;

	if (data.dataType === "float16") {
		texture = new DataTexture(
			data.array.length === sampleCount
				? data.array
				: data.array.subarray(0, sampleCount),
			Math.max(1, width),
			Math.max(1, height),
			RedFormat,
			HalfFloatType,
		);
	} else if (data.dataType === "float32") {
		texture = new DataTexture(
			data.array.length === sampleCount
				? data.array
				: data.array.subarray(0, sampleCount),
			Math.max(1, width),
			Math.max(1, height),
			RedFormat,
			FloatType,
		);
	} else {
		texture = new DataTexture(
			packIntegerScalarToRgba(data, sampleCount),
			Math.max(1, width),
			Math.max(1, height),
			RGBAFormat,
			UnsignedByteType,
		);
	}

	texture.colorSpace = NoColorSpace;
	texture.unpackAlignment = 1;
	configureTexture(texture, textureFilter);
	return texture;
}

function createBitmapTexture(frame: Frame): Texture | null {
	if (frame.data.kind !== "bitmap") {
		return null;
	}

	const texture = new Texture(frame.data.bitmap);
	texture.colorSpace =
		frame.data.colorSpace === "srgb" ? SRGBColorSpace : LinearSRGBColorSpace;
	configureTexture(texture, LinearFilter);
	return texture;
}

function createFrameTexture(
	part: ImageCanvasTexturePart,
	frame: Frame,
	filter: "linear" | "nearest",
): Texture | null {
	if (part === "error") {
		return frame.error
			? createScalarTexture(frame.error, frame.width, frame.height, filter)
			: null;
	}

	if (frame.data.kind === "bitmap") {
		return createBitmapTexture(frame);
	}

	return createScalarTexture(frame.data, frame.width, frame.height, filter);
}

export function useImageTextureCache(model: Model): ImageTextureCache {
	const cacheRef = useRef(new Map<string, Texture>());

	useEffect(() => {
		const retainKeys = getModelRetainTextureKeys(model);
		const cache = cacheRef.current;

		for (const [key, texture] of cache) {
			if (!retainKeys.has(key)) {
				texture.dispose();
				cache.delete(key);
			}
		}
	}, [model]);

	useEffect(() => {
		const cache = cacheRef.current;
		return () => {
			for (const texture of cache.values()) {
				texture.dispose();
			}
			cache.clear();
		};
	}, []);

	return useMemo(
		() => ({
			getTexture: (
				layer: ImageCanvasLayerRole,
				part: ImageCanvasTexturePart,
				frame: Frame,
				filter: "linear" | "nearest",
			) => {
				const key = getTextureCacheKey(layer, part, frame.id);
				const cached = cacheRef.current.get(key);
				if (cached) {
					return cached;
				}

				const texture = createFrameTexture(part, frame, filter);
				if (!texture) {
					return null;
				}

				cacheRef.current.set(key, texture);
				return texture;
			},
		}),
		[],
	);
}
