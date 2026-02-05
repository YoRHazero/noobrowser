import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";
import type {
  SaveFitResultResponse,
  SaveFitResultVariables,
} from "./schemas";

export function useSaveFitResult() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const backendUrl = useConnectionStore((state) => state.backendUrl);

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SaveFitResultResponse,
    Error,
    SaveFitResultVariables
  >({
    mutationFn: async ({ jobId, tags = [] }) => {
      const url = `${backendUrl}/catalog/save/${jobId}/`;
      const response = await axios.post(url, { tags });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate catalog list and potentially fit job status
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      queryClient.invalidateQueries({ queryKey: ["fit-jobs"] });
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return mutation;
}
