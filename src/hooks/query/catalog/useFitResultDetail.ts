import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { FitResultDetailResponse } from "./schemas";

export function useFitResultDetail(jobId: string, enabled = true) {
  return useQueryAxiosGet<FitResultDetailResponse>({
    queryKey: ["catalog", "result", jobId],
    path: `/catalog/results/${jobId}/`,
    enabled: enabled && !!jobId,
  });
}
