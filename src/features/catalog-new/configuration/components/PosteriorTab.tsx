import { usePlotCatalogPosterior } from "@/hooks/query/plot";
import { BlobImage } from "../../components/BlobImage";

interface PosteriorTabProps {
  jobId: string;
  modelName: string;
}

export function PosteriorTab({ jobId, modelName }: PosteriorTabProps) {
  const query = usePlotCatalogPosterior({
    jobId: jobId,
    model_name: modelName,
  });

  return (
    <BlobImage
      blob={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      alt={`Posterior Plot - ${modelName}`}
    />
  );
}
