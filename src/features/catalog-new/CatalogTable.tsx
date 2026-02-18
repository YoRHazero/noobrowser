import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useCatalogTable } from "./hooks/useCatalogTable";
import { SourceTable } from "./components/SourceTable";

export function CatalogTable() {
  const {
    query,
    page,
    pageSize,
    selectedSourceId,
    handlePageChange,
    setSelectedSource,
  } = useCatalogTable();

  const { data, isLoading, isError, error } = query;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="full" w="full">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" h="full" w="full">
        <Text color="red.500">Error loading catalog: {(error as Error).message}</Text>
      </Flex>
    );
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <SourceTable
      items={items}
      total={total}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      selectedSourceId={selectedSourceId}
      onPageChange={handlePageChange}
      onSelect={setSelectedSource}
    />
  );
}
