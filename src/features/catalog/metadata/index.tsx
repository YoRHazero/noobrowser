import {
  Badge,
  Box,
  Heading,
  HStack,
  Stack,
  useSlotRecipe,
  Spinner,
} from "@chakra-ui/react";
import { catalogDetailRecipe } from "../recipes/catalog-detail.recipe";
import { useSourceMetadata } from "./hooks/useSourceMetadata";
import { DetailItem } from "./components/DetailItem";
import { EditableDetailItem } from "./components/EditableDetailItem";
import { DeleteSourceButton } from "./components/DeleteSourceButton";

export function SourceMetadata() {
  const recipe = useSlotRecipe({ recipe: catalogDetailRecipe });
  const styles = recipe({});

  /* -------------------------------------------------------------------------- */
  /*                                    Hook                                    */
  /* -------------------------------------------------------------------------- */
  const { source, isLoading, isError, error, handleUpdate, handleDelete, isDeleting } = useSourceMetadata();

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  if (isLoading) {
      return <Spinner size="sm" />;
  }

  if (isError) {
      return <Box color="red.500">Error: {(error as Error).message}</Box>;
  }

  if (!source) {
      return null;
  }

  return (
    <Box css={styles.content}>
      <Stack css={styles.section}>
        <HStack justify="space-between">
            <Heading size="md">Source {source.id}</Heading>
            <DeleteSourceButton 
                sourceId={source.id} 
                onConfirm={handleDelete} 
                isLoading={isDeleting} 
            />
        </HStack>

        <HStack gap={2} wrap="wrap">
          {source.tags.map((tag) => (
            <Badge key={tag} colorPalette="purple" variant="subtle">
              {tag}
            </Badge>
          ))}
          {/* TODO: Add Tag Editing UI here */}
        </HStack>

        <Box css={styles.grid}>
          <DetailItem label="RA" value={source.ra.toFixed(6)} />
          <DetailItem label="Dec" value={source.dec.toFixed(6)} />
          {/* Editable Fields */}
          <EditableDetailItem
            key={`z-${source.id}`}
            label="Redshift (z)"
            value={source.z?.toString() ?? ""}
            onSubmit={(val) => handleUpdate({ z: parseFloat(val) || null })}
          />
          <EditableDetailItem
            key={`user-${source.id}`}
            label="User"
            value={source.user ?? ""}
            onSubmit={(val) => handleUpdate({ user: val || null })}
          />

          <DetailItem label="Pixel X" value={source.pixel_x.toFixed(1)} />
          <DetailItem label="Pixel Y" value={source.pixel_y.toFixed(1)} />
          <DetailItem label="Ref Basename" value={source.ref_basename} />
          <DetailItem
            label="Created At"
            value={new Date(source.created_at).toLocaleString()}
          />
        </Box>
      </Stack>
    </Box>
  );
}
