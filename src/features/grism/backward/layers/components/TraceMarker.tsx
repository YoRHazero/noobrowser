import { useSourcesStore } from "@/stores/sources";
import { type TraceSource } from "@/stores/stores-types";
import { Circle } from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { useShallow } from "zustand/react/shallow";

const RADIUS_NORMAL = 4;
const RADIUS_MAIN = 6;
const COLOR_BORDER = "#000000";
const Z_INDEX_NORMAL = 1.0;
const Z_INDEX_MAIN = 1.1;

export const TraceMarker = ({
	source,
	isMain,
	removeSource,
	setMain,
}: {
	source: TraceSource;
	isMain: boolean;
	removeSource: (id: string) => void;
	setMain: (id: string | null) => void;
}) => {
	const groupRef = useRef<Group>(null);

	useFrame(({ camera }) => {
		if (!groupRef.current) return;
		const scale = 1 / camera.zoom;
		groupRef.current.scale.set(scale, scale, 1);
	});

	const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation();
		e.nativeEvent.preventDefault();

		const isModPressed = e.nativeEvent.metaKey || e.nativeEvent.ctrlKey;

		if (isModPressed) {
			removeSource(source.id);
		} else {
			setMain(source.id);
		}
	};
	const currentRadius = isMain ? RADIUS_MAIN : RADIUS_NORMAL;

	return (
		<group
			ref={groupRef}
			position={[source.x, -source.y, isMain ? Z_INDEX_MAIN : Z_INDEX_NORMAL]}
			onContextMenu={handleContextMenu}
		>
			{/* edge border circle */}
			<Circle args={[currentRadius + 1, 32]} position={[0, 0, -0.001]}>
				<meshBasicMaterial color={COLOR_BORDER} />
			</Circle>
			{/* fill color circle */}
			<Circle args={[currentRadius, 32]}>
				<meshBasicMaterial color={source.color} />
			</Circle>
		</group>
	);
};

export function TraceMarkersLayer() {
	const {
		traceMode,
		traceSources,
		mainTraceSourceId,
		setMainTraceSource,
		removeTraceSource,
	} = useSourcesStore(
		useShallow((state) => ({
			traceMode: state.traceMode,
			traceSources: state.traceSources,
			mainTraceSourceId: state.mainTraceSourceId,
			setMainTraceSource: state.setMainTraceSource,
			removeTraceSource: state.removeTraceSource,
		})),
	);

	if (!traceMode) return null;

	return (
		<>
			{traceSources.map((source) => (
				<TraceMarker
					key={source.id}
					source={source}
					isMain={source.id === mainTraceSourceId}
					removeSource={removeTraceSource}
					setMain={setMainTraceSource}
				/>
			))}
		</>
	);
}
