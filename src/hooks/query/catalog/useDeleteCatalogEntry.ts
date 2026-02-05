import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";
import type { DeleteCatalogResponse } from "./schemas";

export function useDeleteCatalogEntry() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const backendUrl = useConnectionStore((state) => state.backendUrl);

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteCatalogResponse, Error, string>({
    mutationFn: async (sourceId: string) => {
      // NOTE: Trailing slash is important based on backend router
      const url = `${backendUrl}/catalog/${sourceId}/`;
      const response = await axios.delete(url);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return mutation;
}
