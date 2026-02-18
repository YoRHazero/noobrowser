import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnectionStore } from "@/stores/connection";
import axios from "axios";
import type { CatalogSourceDetailResponse, CatalogUpdateBody } from "./schemas";

interface UpdateCatalogEntryVariables {
  sourceId: string;
  body: CatalogUpdateBody;
}

export function useUpdateCatalogEntry() {
  const backendUrl = useConnectionStore((state) => state.backendUrl);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sourceId, body }: UpdateCatalogEntryVariables) => {
      const { data } = await axios.patch<CatalogSourceDetailResponse>(
        `${backendUrl}/catalog/${sourceId}/`,
        body
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific source detail
      queryClient.invalidateQueries({
        queryKey: ["catalog", "source", variables.sourceId],
      });
      // Invalidate list query as z/tags/user might be shown there
      queryClient.invalidateQueries({ queryKey: ["catalog", "list"] });
    },
  });
}
