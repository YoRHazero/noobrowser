import {
	Box,
	Button,
	Heading,
	HStack,
	Image,
	Link,
	Stack,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

interface ResultImageProps {
	title: string;
	url: string;
}

export function ResultImage({ title, url }: ResultImageProps) {
	return (
		<Stack gap={2} h="full">
			<HStack justify="space-between" align="center">
				<Heading size="xs" color="gray.400">
					{title}
				</Heading>
				<Tooltip content="Open image in new tab">
					<Link href={url} target="_blank">
						<Button size="xs" variant="ghost" colorPalette="cyan">
							<ExternalLink size={14} /> Open URL
						</Button>
					</Link>
				</Tooltip>
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
			>
				<Image
					src={url}
					alt={title}
					objectFit="contain"
					w="full"
					maxH="500px"
				/>
			</Box>
		</Stack>
	);
}
