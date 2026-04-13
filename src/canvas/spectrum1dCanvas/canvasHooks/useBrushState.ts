import type {
	BaseBrushState,
	Bounds,
	BrushProps,
	UpdateBrush,
} from "@visx/brush";
import type { ScaleLinear } from "d3-scale";
import { useCallback, useEffect, useRef } from "react";
import type { Spectrum1DCanvasWaveRange } from "../api";

type BrushInnerRef = NonNullable<BrushProps["innerRef"]>;

export function useBrushState({
	wavelengthsUm,
	startIndex,
	endIndex,
	xScale,
	onSliceRangeChange,
}: {
	wavelengthsUm: readonly number[];
	startIndex: number;
	endIndex: number;
	xScale: ScaleLinear<number, number>;
	onSliceRangeChange: (range: Spectrum1DCanvasWaveRange) => void;
}) {
	const brushRef = useRef<BrushInnerRef["current"]>(null);
	const brushMoveRef = useRef(false);
	const handleBrushChange = useCallback(
		(domain: Bounds | null) => {
			if (!domain) {
				return;
			}

			brushMoveRef.current = true;
			const { x0, x1 } = domain;
			const [minUm, maxUm] = x0 < x1 ? [x0, x1] : [x1, x0];
			if (minUm === maxUm) {
				return;
			}

			onSliceRangeChange({ minUm, maxUm });
		},
		[onSliceRangeChange],
	);

	useEffect(() => {
		const brush = brushRef.current;
		if (!brush || wavelengthsUm.length === 0) {
			return;
		}

		if (brushMoveRef.current) {
			brushMoveRef.current = false;
			return;
		}

		const safeStartIndex =
			startIndex >= 0 ? Math.min(startIndex, wavelengthsUm.length - 1) : 0;
		const safeEndIndex =
			endIndex >= 0
				? Math.min(endIndex, wavelengthsUm.length - 1)
				: wavelengthsUm.length - 1;
		const updater: UpdateBrush = (prevBrush) => {
			const nextExtent = brush.getExtent(
				{ x: xScale(wavelengthsUm[safeStartIndex]) },
				{ x: xScale(wavelengthsUm[safeEndIndex]) },
			);
			const nextState: BaseBrushState = {
				...prevBrush,
				start: { y: nextExtent.y0, x: nextExtent.x0 },
				end: { y: nextExtent.y1, x: nextExtent.x1 },
				extent: nextExtent,
			};
			return nextState;
		};

		brush.updateBrush(updater);
	}, [endIndex, startIndex, wavelengthsUm, xScale]);

	return {
		brushRef,
		handleBrushChange,
	};
}
