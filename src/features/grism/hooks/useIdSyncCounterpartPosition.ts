import { useEffect } from "react";
import { useCounterpartFootprint } from "@/hooks/query/image/useCounterpartFootprint";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";

export function useIdSyncCounterpartPosition() {
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const setCounterpartPosition = useCounterpartStore(
		(state) => state.setCounterpartPosition,
	);
	const { data: footprintData, isSuccess: isFootprintSuccess } =
		useCounterpartFootprint({
			selectedFootprintId,
			enabled: !!selectedFootprintId,
		});

	useEffect(() => {
		if (!isFootprintSuccess || !footprintData) return;

		const { vertex_marker } = footprintData.footprint;
		setCounterpartPosition({
			x0: vertex_marker[0][0],
			y0: vertex_marker[0][1],
			width: vertex_marker[2][0] - vertex_marker[0][0],
			height: vertex_marker[2][1] - vertex_marker[0][1],
		});
	}, [isFootprintSuccess, footprintData, setCounterpartPosition]);
	return { selectedFootprintId };
}
