import { useEmissionMask, useEmissionMaskRegions } from "@/hooks/query/image";
import { useGrismStore } from "@/stores/image";
import { useEffect, useState } from "react";
import {
	ClampToEdgeWrapping,
	DataTexture,
	LinearFilter,
	RedFormat,
	UnsignedByteType,
} from "three";
import { useShallow } from "zustand/react/shallow";

export function useEmissionMaskLayer() {
	const { emissionMaskVisible, emissionMaskThreshold } = useGrismStore(
		useShallow((state) => ({
			emissionMaskVisible: state.emissionMaskVisible,
			emissionMaskThreshold: state.emissionMaskThreshold,
		})),
	);

	const emissionMaskQuery = useEmissionMask({
		enabled: emissionMaskVisible,
	});

	const regionsQuery = useEmissionMaskRegions({
		enabled: emissionMaskVisible,
	});

	const [texture, setTexture] = useState<DataTexture | null>(null);

	useEffect(() => {
		if (!emissionMaskQuery.isSuccess || !emissionMaskQuery.data) {
			setTexture(null);
			return;
		}

		const { buffer, width, height } = emissionMaskQuery.data;
		const uint8Array = new Uint8Array(buffer);

		const dataTexture = new DataTexture(
			uint8Array,
			width,
			height,
			RedFormat,
			UnsignedByteType,
		);

		dataTexture.minFilter = LinearFilter;
		dataTexture.magFilter = LinearFilter;
		dataTexture.wrapS = ClampToEdgeWrapping;
		dataTexture.wrapT = ClampToEdgeWrapping;
		dataTexture.flipY = true;
		dataTexture.needsUpdate = true;

		setTexture(dataTexture);

		return () => {
			dataTexture.dispose();
		};
	}, [emissionMaskQuery.data, emissionMaskQuery.isSuccess]);

	const maskData = emissionMaskQuery.data;

	return {
		isVisible: emissionMaskVisible && !!texture && !!maskData,
		texture,
		threshold: emissionMaskThreshold,
		maxValue: maskData?.maxValue ?? 1,
		xStart: maskData?.xStart ?? 0,
		yStart: maskData?.yStart ?? 0,
		width: maskData?.width ?? 0,
		height: maskData?.height ?? 0,
		isLoading: emissionMaskQuery.isLoading,
		regions: regionsQuery.data?.regions ?? [],
	};
}
