import { useCatalogTable } from "./hooks/useCatalogTable";
import { SourceTable } from "./components/SourceTable";
import { QueryWrapper } from "@/components/ui/query-wrapper";

export function CatalogTable() {
  const {
    query,
    page,
    pageSize,
    selectedSourceId,
    handlePageChange,
    setSelectedSource,
  } = useCatalogTable();

  const { data } = query;

  return (
    <QueryWrapper query={query} errorPrefix="Error loading catalog:">
      <SourceTable
        items={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        totalPages={Math.ceil((data?.total ?? 0) / pageSize)}
        selectedSourceId={selectedSourceId}
        onPageChange={handlePageChange}
        onSelect={setSelectedSource}
      />
    </QueryWrapper>
  );
}
