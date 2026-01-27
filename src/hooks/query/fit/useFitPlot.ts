import { useConnectionStore } from "@/stores/connection";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FitPlotRequest } from "./schemas";

export function useFitPlot({
	source_id,
	model_name,
	config,
	enabled = true,
}: FitPlotRequest & { enabled?: boolean }) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	return useQuery({
		queryKey: ["fit_plot", source_id, model_name, config],
		enabled: enabled && !!source_id && !!model_name,
		queryFn: async () => {
			const response = await axios.post(
				`${backendUrl}/fit/plot/`,
				{
					source_id,
					model_name,
					config,
				},
				{
					responseType: "arraybuffer",
				},
			);
			return new Blob([response.data], { type: "image/png" });
		},
	});
}
