import { usePlotCatalogTrace } from "@/hooks/query/plot";
import { BlobImage } from "../../components/BlobImage";

interface TraceTabProps {
  jobId: string;
  modelName: string;
}

export function TraceTab({ jobId, modelName }: TraceTabProps) {
  const query = usePlotCatalogTrace({
    jobId: jobId,
    model_name: modelName,
  });

  return (
    <BlobImage
      blob={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      alt={`Trace Plot - ${modelName}`}
    />
  );
}
