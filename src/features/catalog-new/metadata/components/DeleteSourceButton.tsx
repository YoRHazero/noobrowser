import {
  Button,
  Dialog,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";

interface DeleteSourceButtonProps {
  sourceId: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteSourceButton({
  sourceId,
  onConfirm,
  isLoading,
}: DeleteSourceButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root role="alertdialog" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <IconButton
          variant="ghost"
          size="sm"
          colorPalette="red"
          aria-label="Delete Source"
        >
          <FiTrash2 />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete Source</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>
              Are you sure you want to delete source {sourceId}? This action cannot be undone.
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.CloseTrigger>
            <Button
              colorPalette="red"
              onClick={() => {
                  onConfirm();
                  // Ideally close dialog after success, but parent handles async
              }}
              loading={isLoading}
            >
              Delete
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
