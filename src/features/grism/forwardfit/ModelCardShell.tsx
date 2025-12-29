import {
    Box,
	HStack,
	IconButton,
	Input,
	Stack,
	Switch,
} from "@chakra-ui/react";
import { useId } from "react";
import { LuTrash2 } from "react-icons/lu";

import { TabbedColorPicker } from "@/components/ui/color-chooser";
import {
	StepConfigPopover,
	type StepControlItem,
} from "@/components/ui/step-config-popover";
import { Tooltip } from "@/components/ui/tooltip";

interface ModelCardShellProps {
	/** Model Name (e.g. "Line 1") */
	name: string;
	onRename: (name: string) => void;

	/** Color string (hex/rgba) */
	color: string;
	onColorChange: (color: string) => void;

	/** Is model active? */
	active: boolean;
	onToggleActive: (active: boolean) => void;

	/** Delete callback */
	onRemove: () => void;

	/** Configuration for the "Step Set" popover */
	stepControls: StepControlItem[];

	/** Formula text to display (e.g. "y = kx + b") */
	formula: React.ReactNode;

	/** The specific inputs for the model (Linear or Gaussian params) */
	children: React.ReactNode;
}

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

	const activeSwitchId = useId();
	const tooltipLabel = active ? "Deactivate model" : "Activate model";

	return (
		<Stack
			gap={2}
			borderWidth="1px"
			borderRadius="md"
			p={2}
			bg="bg.subtle"
			borderColor={active ? "border" : "border.subtle"}
			opacity={active ? 1 : 0.6}
			transition="opacity 0.2s"
		>
			{/* Header Row: Name | Color | Switch | Settings | Delete */}
			<HStack justify="space-between" align="center">
				<Input
					size="xs"
					fontWeight="semibold"
					maxW="140px"
					value={name}
					onChange={(e) => onRename(e.target.value)}
					placeholder="Model name"
					variant="subtle"
				/>

				<HStack gap={1} align="center">
					<TabbedColorPicker value={color} onValueChange={onColorChange} />

					<Tooltip ids={{ trigger: activeSwitchId }} content={tooltipLabel}>
						<Switch.Root
							size="sm"
							ids={{ root: activeSwitchId }}
							checked={active}
							onCheckedChange={(details) => onToggleActive(details.checked)}
						>
							<Switch.HiddenInput />
							<Switch.Control />
							<Switch.Label srOnly>Active</Switch.Label>
						</Switch.Root>
					</Tooltip>

					<StepConfigPopover controls={stepControls} disabled={!active} />

					<IconButton
						aria-label="Delete model"
						size="xs"
						variant="ghost"
						colorPalette="red"
						onClick={onRemove}
					>
						<LuTrash2 />
					</IconButton>
				</HStack>
			</HStack>

			{/* Formula Display */}
			<Box textStyle="xs" color="fg.muted" fontFamily="mono">
				{formula}
			</Box>

			{/* Parameters Body */}
			<Stack
				gap={1} // Compact gap
				opacity={active ? 1 : 0.8}
				pointerEvents={active ? "auto" : "none"}
			>
				{children}
			</Stack>
		</Stack>
	);
}