import {
	Box,
	HStack,
	IconButton,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { panelRecipe } from "./Panel.recipe";

export interface PanelProps {
	title: string;
	onClose: () => void;
	children: ReactNode;
}

export function Panel({ title, onClose, children }: PanelProps) {
	const recipe = useSlotRecipe({ recipe: panelRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<HStack css={styles.header}>
				<Stack gap={0} css={styles.titleGroup}>
					<Text css={styles.eyebrow}>{title}</Text>
					<Text css={styles.title}>Overview Controls</Text>
				</Stack>

				<IconButton
					aria-label="Close overview viewer controls"
					variant="plain"
					css={styles.closeButton}
					onClick={onClose}
				>
					<FiX />
				</IconButton>
			</HStack>

			<Stack css={styles.content} gap={3}>
				{children}
			</Stack>
		</Box>
	);
}
