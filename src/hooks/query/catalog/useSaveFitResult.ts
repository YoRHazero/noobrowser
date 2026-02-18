import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";

interface SaveFitResultVariables {
  jobId: string;
  tags: string[];
}

interface SaveFitResultResponse {
  status: string;
  message: string;
  source_id: string;
}

export function useSaveFitResult() {
  const backendUrl = useConnectionStore((state) => state.backendUrl);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, tags }: SaveFitResultVariables) => {
      const { data } = await axios.post<SaveFitResultResponse>(
        `${backendUrl}/catalog/save/${jobId}/`,
        { tags }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      queryClient.invalidateQueries({ queryKey: ["fit"] });
    },
  });
}
