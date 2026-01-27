import { useConnectionStore } from "@/stores/connection";
import { useGlobeStore } from "@/stores/footprints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { EmissionMaskData } from "./schemas";

export function useEmissionMask({
	enabled = true,
}: {
	enabled?: boolean;
} = {}) {
	const groupId = useGlobeStore((state) => state.selectedFootprintId);
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	return useQuery({
		queryKey: ["emission_mask", groupId],
		enabled: enabled && !!groupId,
		queryFn: async () => {
			const response = await axios.get(
				`${backendUrl}/wfss/emission_mask/${groupId}`,
				{
					responseType: "arraybuffer",
				},
			);
			const buffer = response.data as ArrayBuffer;
			const headers = response.headers;

			const xStart = Number(headers["x-data-x-start"]);
			const xEnd = Number(headers["x-data-x-end"]);
			const yStart = Number(headers["x-data-y-start"]);
			const yEnd = Number(headers["x-data-y-end"]);

			const width = xEnd - xStart;
			const height = yEnd - yStart;
			
			// Find max value in the uint8 buffer
			const uint8Array = new Uint8Array(buffer);
			let maxValue = 0;
			for (let i = 0; i < uint8Array.length; i++) {
				if (uint8Array[i] > maxValue) maxValue = uint8Array[i];
			}

			return {
				buffer,
				width,
				height,
				xStart,
				yStart,
				maxValue,
			} as EmissionMaskData;
		},
	});
}
