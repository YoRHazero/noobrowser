import { Image, Spinner, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function useBlobUrl(blob: Blob | null) {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!blob) {
			setUrl(null);
			return;
		}
		const objectUrl = URL.createObjectURL(blob);
		setUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [blob]);

	return url;
}

interface PlotImagePanelProps {
	label: string;
	blob: Blob | null;
	isFetching: boolean;
	error?: string | null;
}

export function PlotImagePanel({
	label,
	blob,
	isFetching,
	error,
}: PlotImagePanelProps) {
	const url = useBlobUrl(blob);

	return (
		<Stack gap={2} align="center">
			{isFetching && <Spinner size="lg" />}
			{error && (
				<Text color="red.400" fontSize="sm">
					{error}
				</Text>
			)}
			{url ? (
				<Image
					src={url}
					alt={label}
					objectFit="contain"
					maxH="800px"
					w="full"
				/>
			) : (
				!isFetching && <Text color="fg.muted">No plot available.</Text>
			)}
		</Stack>
	);
}
