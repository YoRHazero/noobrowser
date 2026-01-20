import { useDispersionTrace } from "@/hook/connection-hook";
import { useSourcesStore } from "@/stores/sources";
import { type TraceSource } from "@/stores/stores-types";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

const LINE_WIDTH = 1.5;
const MAIN_LINE_WIDTH = 2.5;
const LINE_Z_INDEX = 0.9;

export const TraceSingleLine = ({
	source,
	isMain,
	currentBasename,
	enabled = false,
}: {
	source: TraceSource;
	isMain: boolean;
	currentBasename?: string;
	enabled?: boolean;
}) => {
	const { data: traceData, isSuccess } = useDispersionTrace({
		x: source.x,
		y: source.y,
		basename: currentBasename,
		enabled: enabled,
	});
	const zIndex = isMain ? LINE_Z_INDEX + 0.01 : LINE_Z_INDEX;
	const points = useMemo(() => {
		if (!isSuccess || !traceData) return;

		const xs = traceData.trace_xs;
		const ys = traceData.trace_ys;
		if (xs.length !== ys.length) return;
		const length = xs.length;

		const pts: [number, number, number][] = new Array(length);
		for (let i = 0; i < length; i++) {
			pts[i] = [xs[i], -ys[i], zIndex];
		}
		return pts;
	}, [isSuccess, traceData, zIndex]);
	if (!points || points.length === 0) return null;

	return (
		<Line
			points={points}
			color={source.color}
			lineWidth={isMain ? MAIN_LINE_WIDTH : LINE_WIDTH}
			transparent
			opacity={0.8}
			toneMapped={false}
		/>
	);
};

export function TraceLinesLayer() {
	const { traceMode, traceSources, mainTraceSourceId } = useSourcesStore(
		useShallow((state) => ({
			traceMode: state.traceMode,
			traceSources: state.traceSources,
			mainTraceSourceId: state.mainTraceSourceId,
		})),
	);
	if (!traceMode) return null;

	return (
		<group>
			{traceSources.map((source) => (
				<TraceSingleLine
					key={source.id}
					source={source}
					isMain={source.id === mainTraceSourceId}
					enabled={traceMode}
				/>
			))}
		</group>
	);
}
