import {
	Box,
	HStack,
	IconButton,
	Input,
	Stack,
	Switch,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { CSSProperties, ReactNode } from "react";
import { LuTrash2 } from "react-icons/lu";
import { TabbedColorPicker } from "@/components/ui/color-chooser";
import {
	StepConfigPopover,
	type StepControlItem,
} from "@/components/ui/step-config-popover";
import { Tooltip } from "@/components/ui/tooltip";
import { fitModelCardRecipe } from "../recipes/fit-model-card.recipe";

interface ModelCardShellProps {
	name: string;
	onRename: (name: string) => void;
	color: string;
	onColorChange: (color: string) => void;
	active: boolean;
	onToggleActive: (active: boolean) => void;
	onRemove: () => void;
	stepControls: StepControlItem[];
	formula: ReactNode;
	children: ReactNode;
}

type AccentStyle = CSSProperties & {
	"--fit-model-accent"?: string;
};

export default function ModelCardShell(props: ModelCardShellProps) {
	const {
		name,
		onRename,
		color,
		onColorChange,
		active,
		onToggleActive,
		onRemove,
		stepControls,
		formula,
		children,
	} = props;

	const tooltipLabel = active ? "Deactivate model" : "Activate model";

	const recipe = useSlotRecipe({ recipe: fitModelCardRecipe });
	const styles = recipe({ active });
	const accentStyle: AccentStyle = {
		"--fit-model-accent": color,
	};

	return (
		<Stack css={styles.root} style={accentStyle}>
			<HStack css={styles.header}>
				<Input
					size="xs"
					maxW="140px"
					value={name}
					onChange={(e) => onRename(e.target.value)}
					placeholder="MODEL_ID"
					css={styles.nameInput}
				/>

				<HStack css={styles.actionGroup}>
					<TabbedColorPicker value={color} onValueChange={onColorChange} />

					<Tooltip content={tooltipLabel}>
						<Switch.Root
							size="sm"
							colorPalette="cyan"
							checked={active}
							onCheckedChange={(details) => onToggleActive(details.checked)}
						>
							<Switch.HiddenInput />
							<Switch.Control css={styles.switchControl} />
							<Switch.Label srOnly>Active</Switch.Label>
						</Switch.Root>
					</Tooltip>

					<Box>
						<StepConfigPopover controls={stepControls} disabled={!active} />
					</Box>

					<IconButton
						aria-label="Delete model"
						size="xs"
						variant="ghost"
						css={styles.iconButton}
						onClick={onRemove}
					>
						<LuTrash2 />
					</IconButton>
				</HStack>
			</HStack>

			<Box css={styles.formula}>{formula}</Box>

			<Stack css={styles.body}>{children}</Stack>
		</Stack>
	);
}
