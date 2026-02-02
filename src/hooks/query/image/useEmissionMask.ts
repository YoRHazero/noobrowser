import { useConnectionStore } from "@/stores/connection";
import { useGlobeStore } from "@/stores/footprints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { EmissionMaskData } from "./schemas";

export function useEmissionMask({
	enabled = false,
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
			const format = headers["x-mask-format"] || "uint8";
			const frameCount = Number(headers["x-mask-frames"] || 8);

			const width = xEnd - xStart;
			const height = yEnd - yStart;
			
			// Find max value in the buffer (approximate for normalization if needed later, but bitmask uses discrete)
			// For now, returning 0 or calculating if needed. 
			// Existing code used it for normalization, but new logic uses bitmask.
			// Let's keep it 0 or standard max for bitmask type if component needs it.
			let maxValue = 0;
			// Simplified: just set to full range of type to avoid "0" issues
			if (format === 'uint8') maxValue = 255;
			else if (format === 'uint16') maxValue = 65535;
			else maxValue = 4294967295;

			return {
				buffer,
				width,
				height,
				xStart,
				yStart,
				maxValue,
				format,
				frameCount,
			} as EmissionMaskData;
		},
	});
}
