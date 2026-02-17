import {
    Box,
    Button,
    Heading,
    HStack,
    Image,
    Link,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface ResultImageProps {
    title: string;
    src: string | null;
    isLoading?: boolean;
    error?: string | null;
}

export function ResultImage({
    title,
    src,
    isLoading,
    error,
}: ResultImageProps) {
    return (
        <Stack gap={2} h="full">
            <HStack justify="space-between" align="center">
                <Heading size="xs" color="gray.400">
                    {title}
                </Heading>
                {src && (
                    <Tooltip content="Open image in new tab">
                        <Link href={src} target="_blank">
                            <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="cyan"
                            >
                                <ExternalLink size={14} /> Open
                            </Button>
                        </Link>
                    </Tooltip>
                )}
            </HStack>
            <Box
                borderRadius="md"
                overflow="hidden"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                bg="black"
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="240px"
            >
                {isLoading ? (
                    <Spinner size="lg" color="cyan.300" />
                ) : error ? (
                    <Text
                        fontSize="xs"
                        color="red.300"
                        textAlign="center"
                        px={4}
                    >
                        {error}
                    </Text>
                ) : src ? (
                    <Image src={src} alt={title} objectFit="contain" w="full" />
                ) : (
                    <Text fontSize="xs" color="gray.400">
                        No image available.
                    </Text>
                )}
            </Box>
        </Stack>
    );
}
