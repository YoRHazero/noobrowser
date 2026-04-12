"use client";

import {
	Box,
	Button,
	HStack,
	Image,
	Spinner,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { resultImageRecipe } from "./ResultImage.recipe";

type ResultImageProps = {
	title: string;
	src: string | null;
	isLoading: boolean;
	error: string | null;
};

export default function ResultImage({
	title,
	src,
	isLoading,
	error,
}: ResultImageProps) {
	const recipe = useSlotRecipe({ recipe: resultImageRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<HStack css={styles.header}>
				<Text css={styles.title}>{title}</Text>
				{src ? (
					<Tooltip content="Open in a new tab" showArrow>
						<Button asChild size="xs" variant="ghost" css={styles.openLink}>
							<a href={src} target="_blank" rel="noreferrer">
								<ExternalLink size={14} />
								Open
							</a>
						</Button>
					</Tooltip>
				) : null}
			</HStack>

			<Box css={styles.frame}>
				{isLoading ? (
					<Spinner size="lg" css={styles.spinner} />
				) : error ? (
					<Text css={styles.errorText}>{error}</Text>
				) : src ? (
					<Image src={src} alt={title} css={styles.image} />
				) : (
					<Text css={styles.emptyState}>No image available.</Text>
				)}
			</Box>
		</Stack>
	);
}
