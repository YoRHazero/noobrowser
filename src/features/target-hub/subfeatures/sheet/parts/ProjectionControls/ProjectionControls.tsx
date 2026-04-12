import { HStack, IconButton, useSlotRecipe } from "@chakra-ui/react";
import { Globe, Image } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { projectionControlsRecipe } from "./ProjectionControls.recipe";

const SOURCE_ACTION_ICON_SIZE = 14;

interface ProjectionControlsProps {
	isOverviewVisible: boolean;
	isInspectorVisible: boolean;
	disabled?: boolean;
	onToggleOverview?: () => void;
	onToggleInspector?: () => void;
}

export function ProjectionControls({
	isOverviewVisible,
	isInspectorVisible,
	disabled = false,
	onToggleOverview,
	onToggleInspector,
}: ProjectionControlsProps) {
	const recipe = useSlotRecipe({ recipe: projectionControlsRecipe });
	const styles = recipe();
	const activeChipStyles = recipe({ chipTone: "active" }).chip;

	return (
		<HStack css={styles.chipGroup}>
			<Tooltip content="Overview visibility" showArrow>
				<IconButton
					type="button"
					aria-label="Toggle Overview Visibility"
					size="sm"
					variant="ghost"
					css={isOverviewVisible ? activeChipStyles : styles.chip}
					disabled={disabled}
					onClick={onToggleOverview}
				>
					<Globe size={SOURCE_ACTION_ICON_SIZE} />
				</IconButton>
			</Tooltip>
			<Tooltip content="Inspector visibility" showArrow>
				<IconButton
					type="button"
					aria-label="Toggle Inspector Visibility"
					size="sm"
					variant="ghost"
					css={isInspectorVisible ? activeChipStyles : styles.chip}
					disabled={disabled}
					onClick={onToggleInspector}
				>
					<Image size={SOURCE_ACTION_ICON_SIZE} />
				</IconButton>
			</Tooltip>
		</HStack>
	);
}
