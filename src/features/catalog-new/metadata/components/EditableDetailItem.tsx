import { Box, Editable, IconButton, Text } from "@chakra-ui/react";
import { FiCheck, FiEdit2, FiX } from "react-icons/fi";

interface EditableDetailItemProps {
  label: string;
  value: string;
  onSubmit: (nextValue: string) => void;
}

export function EditableDetailItem({
  label,
  value,
  onSubmit,
}: EditableDetailItemProps) {
  return (
    <Box>
      <Text fontSize="xs" color="fg.muted" textTransform="uppercase" mb={1}>
        {label}
      </Text>
      <Editable.Root
        defaultValue={value}
        fontSize="sm"
        fontWeight="medium"
        fontFamily="mono"
        submitMode="enter"
        onValueCommit={(val) => onSubmit(val.value)}
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs" aria-label="Edit">
              <FiEdit2 />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="ghost" size="xs" aria-label="Cancel">
              <FiX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="ghost" size="xs" aria-label="Submit">
              <FiCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
    </Box>
  );
}
