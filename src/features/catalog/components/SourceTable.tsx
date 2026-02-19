import {
  Box,
  HStack,
  IconButton,
  Table,
  Text,
  useSlotRecipe,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { catalogTableRecipe } from "../recipes/catalog-table.recipe";
import type { CatalogItemListResponse } from "@/hooks/query/catalog";

const formatCoord = (val: number) => val.toFixed(6);
const formatZ = (val: number | null) => (val !== null ? val.toFixed(4) : "-");

interface SourceTableProps {
  items: CatalogItemListResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedSourceId: string | null;
  onPageChange: (newPage: number) => void;
  onSelect: (item: CatalogItemListResponse) => void;
}

export function SourceTable({
  items,
  total,
  page,
  totalPages,
  selectedSourceId,
  onPageChange,
  onSelect,
}: SourceTableProps) {
  const recipe = useSlotRecipe({ recipe: catalogTableRecipe });
  const styles = recipe({});

  return (
    <Box css={styles.root} display="flex" flexDirection="column" h="full">
      <Box flex={1} overflow="auto">
        <Table.Root size="sm" interactive stickyHeader>
          <Table.Header css={styles.header}>
            <Table.Row>
              <Table.ColumnHeader>RA</Table.ColumnHeader>
              <Table.ColumnHeader>Dec</Table.ColumnHeader>
              <Table.ColumnHeader>z</Table.ColumnHeader>
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Ref</Table.ColumnHeader>
              <Table.ColumnHeader>Fits</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => {
              const isSelected = item.id === selectedSourceId;
              const rowStyles = recipe({ selected: isSelected });
              return (
                  <Table.Row
                    key={item.id}
                    onClick={() => onSelect(item)}
                    css={rowStyles.row}
                  >
                    <Table.Cell css={styles.cell} fontFamily="mono">
                      {formatCoord(item.ra)}
                    </Table.Cell>
                    <Table.Cell css={styles.cell} fontFamily="mono">
                      {formatCoord(item.dec)}
                    </Table.Cell>
                    <Table.Cell css={styles.cell} fontFamily="mono">
                      {formatZ(item.z)}
                    </Table.Cell>
                    <Table.Cell css={styles.cell}>{item.user ?? "-"}</Table.Cell>
                    <Table.Cell css={styles.cell} whiteSpace="nowrap">
                      {item.ref_basename}
                    </Table.Cell>
                    <Table.Cell css={styles.cell}>
                      {item.fit_count}
                    </Table.Cell>
                  </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Pagination */}
      <HStack css={styles.pagination}>
        <Text fontSize="sm" color="fg.muted">
          Page {page} of {totalPages} ({total} items)
        </Text>
        <HStack>
          <IconButton
            variant="ghost"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            size="sm"
          >
            <FiChevronLeft />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            size="sm"
          >
            <FiChevronRight />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}
