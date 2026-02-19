import { Box, Image, Text, Center, Spinner, IconButton } from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { type ReactNode } from "react";
import { useBlobUrl } from "@/hooks/useBlobUrl";

export interface BlobImageProps {
  blob: Blob | null | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  alt?: string;
  placeholder?: ReactNode;
}

export function BlobImage({
  blob,
  isLoading,
  isError,
  error,
  alt = "Plot",
  placeholder,
}: BlobImageProps) {
  const imageUrl = useBlobUrl(blob);

  if (isLoading) {
    return (
      <Center w="full" h="full" minH="300px" bg="bg.subtle" borderRadius="md">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center w="full" h="full" minH="300px" bg="bg.subtle" borderRadius="md">
        <Text color="red.500">Failed to load plot: {error?.message}</Text>
      </Center>
    );
  }

  if (!imageUrl) {
    return (
      <Center w="full" h="full" minH="300px" bg="bg.subtle" borderRadius="md">
        {placeholder || <Text color="fg.muted">No data available</Text>}
      </Center>
    );
  }

  return (
    <Box w="full" h="full" minH="300px" position="relative" className="group">
      <Image
        src={imageUrl}
        alt={alt}
        w="full"
        h="full"
        objectFit="contain"
        borderRadius="md"
      />
      <IconButton
        position="absolute"
        top={2}
        right={2}
        size="sm"
        variant="surface"
        aria-label="Open in new tab"
        onClick={(e) => {
          e.stopPropagation();
          window.open(imageUrl, "_blank");
        }}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
      >
        <ExternalLink size={16} />
      </IconButton>
    </Box>
  );
}
