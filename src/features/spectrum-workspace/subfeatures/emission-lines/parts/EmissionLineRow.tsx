import { Checkbox, IconButton, Stack, Text } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";

export interface EmissionLineRowProps {
	id: string;
	name: string;
	selected: boolean;
	restWavelengthLabel: string;
	displayWavelengthLabel: string;
	onToggleSelected: (lineId: string) => void;
	onDelete: (lineId: string) => void;
}

export function EmissionLineRow({
	id,
	name,
	selected,
	restWavelengthLabel,
	displayWavelengthLabel,
	onToggleSelected,
	onDelete,
}: EmissionLineRowProps) {
	return (
		<Stack
			direction="row"
			gap={3}
			align="start"
			px={4}
			py={3}
			borderBottomWidth="1px"
			borderColor="border.muted"
		>
			<Checkbox.Root
				mt="1"
				size="sm"
				checked={selected}
				onCheckedChange={() => onToggleSelected(id)}
			>
				<Checkbox.HiddenInput />
				<Checkbox.Control />
			</Checkbox.Root>

			<Stack flex="1" minW={0} gap={1}>
				<Stack direction="row" justify="space-between" gap={3} align="start">
					<Text fontSize="sm" fontWeight="medium" lineClamp={1} title={name}>
						{name}
					</Text>
					<IconButton
						size="xs"
						variant="ghost"
						colorPalette="red"
						aria-label={`Delete ${name}`}
						onClick={() => onDelete(id)}
					>
						<LuTrash2 />
					</IconButton>
				</Stack>
				<Text fontSize="xs" color="fg.muted">
					{restWavelengthLabel}
				</Text>
				<Text fontSize="xs" color="fg.subtle">
					{displayWavelengthLabel}
				</Text>
			</Stack>
		</Stack>
	);
}
