import {
	Box,
	Button,
	CloseButton,
	HStack,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import {
	SHEET_DRAWER_GAP,
	SHEET_JOBS_DRAWER_WIDTH,
	SHEET_LEFT_OFFSET,
	SHEET_WIDTH,
} from "../../shared/constants";
import { sheetRecipe } from "../recipes/sheet.recipe";

interface TargetHubJobsDrawerShellViewProps {
	open: boolean;
	onClose: () => void;
}

const drawerLeft = `calc(${SHEET_LEFT_OFFSET}px + min(${SHEET_WIDTH}px, 100vw - 32px) + ${SHEET_DRAWER_GAP}px)`;

export function TargetHubJobsDrawerShellView({
	open,
	onClose,
}: TargetHubJobsDrawerShellViewProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	if (!open) {
		return null;
	}

	return (
		<Box
			css={{
				...styles.drawer,
				left: drawerLeft,
				w: `min(${SHEET_JOBS_DRAWER_WIDTH}px, calc(100vw - 48px))`,
			}}
		>
			<HStack css={styles.drawerHeader}>
				<Stack gap={0}>
					<Text fontSize="sm" fontWeight="semibold" color="white">
						Fit Jobs
					</Text>
					<Text fontSize="xs" color="whiteAlpha.700">
						Drawer shell only in this phase.
					</Text>
				</Stack>
				<CloseButton size="sm" marginInlineStart="auto" onClick={onClose} />
			</HStack>

			<Stack css={styles.drawerBody} gap={4}>
				<Text fontSize="sm" color="whiteAlpha.760" lineHeight={1.6}>
					This shell reserves the hub-scoped jobs surface without binding any
					real job data yet.
				</Text>
				<Button
					size="sm"
					variant="outline"
					onClick={onClose}
					alignSelf="flex-start"
				>
					Close
				</Button>
			</Stack>
		</Box>
	);
}
