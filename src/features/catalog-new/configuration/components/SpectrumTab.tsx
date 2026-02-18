import { usePlotCatalogSpectrum } from "@/hooks/query/plot";
import { BlobImage } from "../../components/BlobImage";

interface SpectrumTabProps {
  jobId: string;
  modelName: string;
}

export function SpectrumTab({ jobId, modelName }: SpectrumTabProps) {
  const query = usePlotCatalogSpectrum({
    jobId: jobId,
    model_name: modelName,
  });

  return (
    <BlobImage
      blob={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      alt={`Spectrum Plot - ${modelName}`}
    />
  );
}
