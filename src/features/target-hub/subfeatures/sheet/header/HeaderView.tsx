import { Button, HStack, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { LuChevronsLeft } from "react-icons/lu";
import { sheetRecipe } from "../recipes/sheet.recipe";

interface HeaderViewProps {
	onOpenJobs: () => void;
	onReturnToDock: () => void;
}

export function HeaderView({ onOpenJobs, onReturnToDock }: HeaderViewProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.header}>
			<Stack gap={0}>
				<Text css={styles.titleEyebrow}>WFSS Workspace</Text>
				<Text css={styles.title}>Target Hub</Text>
			</Stack>

			<HStack css={styles.headerActions}>
				<Button size="sm" variant="outline" onClick={onOpenJobs}>
					Jobs
				</Button>
				<Button size="sm" variant="ghost" onClick={onReturnToDock}>
					<LuChevronsLeft />
					Dock
				</Button>
			</HStack>
		</HStack>
	);
}
