import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnectionStore } from "@/stores/connection";
import axios from "axios";

export function useDeleteCatalogEntry() {
  const backendUrl = useConnectionStore((state) => state.backendUrl);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceId: string) => {
      const { data } = await axios.delete(`${backendUrl}/catalog/${sourceId}/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}
