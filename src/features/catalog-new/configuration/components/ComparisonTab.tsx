import { usePlotCatalogComparison } from "@/hooks/query/plot";
import { BlobImage } from "../../components/BlobImage";
import { useFitResultDetail } from "@/hooks/query/catalog/useFitResultDetail";
import { Center, Text } from "@chakra-ui/react";

interface ComparisonTabProps {
  jobId: string;
}

export function ComparisonTab({ jobId }: ComparisonTabProps) {
  // First check if we have enough models to compare
  const detailQuery = useFitResultDetail(jobId, !!jobId);
  const hasMultipleModels = (detailQuery.data?.model_results?.length ?? 0) > 1;

  const query = usePlotCatalogComparison({
    jobId: jobId,
    enabled: hasMultipleModels,
  });

  if (detailQuery.isLoading) {
       // Loading detail...
       // We can return null or a skeleton here, but since the plot will load right after...
       // Let's just let the plot loading state handle it if enabled, or wait.
  }

  if (!hasMultipleModels && !detailQuery.isLoading) {
      return (
        <Center w="full" h="full" minH="300px" bg="bg.subtle" borderRadius="md">
            <Text color="fg.muted">Comparison requires multiple models.</Text>
        </Center>
      );
  }

  return (
    <BlobImage
      blob={query.data}
      isLoading={query.isLoading || detailQuery.isLoading}
      isError={query.isError}
      error={query.error}
      alt={`Model Comparison Plot`}
    />
  );
}
