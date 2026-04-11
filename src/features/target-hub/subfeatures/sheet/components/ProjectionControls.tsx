import type { SystemStyleObject } from "@chakra-ui/react";
import { HStack, IconButton, useSlotRecipe } from "@chakra-ui/react";
import { Globe, Image } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { sheetRecipe } from "../recipes/sheet.recipe";

const SOURCE_ACTION_ICON_SIZE = 14;

interface ProjectionControlsProps {
	isOverviewVisible: boolean;
	isInspectorVisible: boolean;
	disabled?: boolean;
	onToggleOverview?: () => void;
	onToggleInspector?: () => void;
}

const getChipStyles = (baseCss: SystemStyleObject, active: boolean) => ({
	...baseCss,
	borderColor: active ? "cyan.300" : baseCss.borderColor,
	bg: active ? "rgba(34, 211, 238, 0.16)" : baseCss.bg,
	color: active ? "white" : baseCss.color,
	boxShadow: active ? "0 0 0 1px rgba(34, 211, 238, 0.22)" : undefined,
});

export function ProjectionControls({
	isOverviewVisible,
	isInspectorVisible,
	disabled = false,
	onToggleOverview,
	onToggleInspector,
}: ProjectionControlsProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.chipGroup}>
			<Tooltip content="Overview visibility" showArrow>
				<IconButton
					type="button"
					aria-label="Toggle Overview Visibility"
					size="sm"
					variant="ghost"
					css={getChipStyles(styles.chip, isOverviewVisible)}
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
					css={getChipStyles(styles.chip, isInspectorVisible)}
					disabled={disabled}
					onClick={onToggleInspector}
				>
					<Image size={SOURCE_ACTION_ICON_SIZE} />
				</IconButton>
			</Tooltip>
		</HStack>
	);
}
