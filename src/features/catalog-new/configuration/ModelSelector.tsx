import {
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useModelSelector } from "./hooks/useModelSelector";

export function ModelSelector() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hook                                    */
  /* -------------------------------------------------------------------------- */
  const { collection, value, isLoading, handleSelectionChange, hasModels } = useModelSelector();

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  if (isLoading) {
      return <Spinner size="sm" />;
  }

  if (!hasModels) {
      return null;
  }

  return (
    <Select.Root
      collection={collection}
      value={value}
      onValueChange={handleSelectionChange}
      size="sm"
      width="200px"
    >
      <Select.Trigger>
        <Select.ValueText placeholder="Select model..." />
      </Select.Trigger>
      <Select.Positioner>
        <Select.Content>
          {collection.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
