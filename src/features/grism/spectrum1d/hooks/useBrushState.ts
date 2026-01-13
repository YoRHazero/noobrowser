import type {
	BaseBrushState,
	Bounds,
	BrushProps,
	UpdateBrush,
} from "@visx/brush";
import type { ScaleLinear } from "d3-scale";
import { useCallback, useEffect, useRef } from "react";

type BrushInnerRef = NonNullable<BrushProps["innerRef"]>;

export function useBrushState(params: {
	waveArray: number[];
	waveStartIndex: number;
	waveEndIndex: number;
	xScaleBrush: ScaleLinear<number, number>;
	onSliceRangeChange: (range: { min: number; max: number }) => void;
}) {
	const {
		waveArray,
		waveStartIndex,
		waveEndIndex,
		xScaleBrush,
		onSliceRangeChange,
	} = params;
	const brushRef = useRef<BrushInnerRef["current"]>(null);
	const brushMoveRef = useRef<boolean>(false);
	const handleBrushChange = useCallback(
		(domain: Bounds | null) => {
			if (!domain) return;
			brushMoveRef.current = true;
			const { x0, x1 } = domain;
			const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
			if (xMin === xMax) {
				return;
			}
			onSliceRangeChange({ min: xMin, max: xMax });
		},
		[onSliceRangeChange],
	);

	useEffect(() => {
		const brush = brushRef.current;
		if (!brush) return;
		if (brushMoveRef.current) {
			brushMoveRef.current = false;
			return;
		}
		const updater: UpdateBrush = (prevBrush) => {
			const newExtent = brush.getExtent(
				{
					x: xScaleBrush(
						waveStartIndex >= 0 ? waveArray[waveStartIndex] : waveArray[0],
					),
				},
				{
					x: xScaleBrush(
						waveEndIndex >= 0
							? waveArray[waveEndIndex]
							: waveArray[waveArray.length - 1],
					),
				},
			);
			const newState: BaseBrushState = {
				...prevBrush,
				start: { y: newExtent.y0, x: newExtent.x0 },
				end: { y: newExtent.y1, x: newExtent.x1 },
				extent: newExtent,
			};
			return newState;
		};
		brush.updateBrush(updater);
	}, [waveStartIndex, waveEndIndex, waveArray, xScaleBrush]);

	return { brushRef, handleBrushChange };
}
