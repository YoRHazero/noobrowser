import { useMemo } from "react";
import type {
	ScreenAnchor,
	Spectrum1DCanvasTooltipViewModel,
} from "../shared/types";
import { useSpectrum1DCanvasInteractionStore } from "../store/interactionStore";
import { formatFlux } from "../utils/formatFlux";
import { getTooltipPosition } from "../utils/getTooltipPosition";

export function useTooltipViewModel({
	anchor,
	wavelengthFormat,
}: {
	anchor: ScreenAnchor;
	wavelengthFormat: (observedWavelengthUm: number) => string;
}): Spectrum1DCanvasTooltipViewModel | null {
	const hoverData = useSpectrum1DCanvasInteractionStore(
		(state) => state.hoverData,
	);

	return useMemo(() => {
		if (!hoverData) {
			return null;
		}

		const position = getTooltipPosition({
			anchor,
			pointer: hoverData.pointer,
		});

		return {
			left: position.x,
			top: position.y,
			wavelengthText: wavelengthFormat(hoverData.point.wavelengthUm),
			fluxText: `Flux ${formatFlux(hoverData.point.flux)}`,
			errorText: `Error ${formatFlux(hoverData.point.error)}`,
		};
	}, [anchor, hoverData, wavelengthFormat]);
}
