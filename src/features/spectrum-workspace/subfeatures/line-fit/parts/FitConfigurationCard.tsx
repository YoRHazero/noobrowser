import { Box, HStack, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitConfigurationCardModel } from "../useSpectrumWorkspaceLineFit";

export function FitConfigurationCard({
	id,
	name,
	selected,
	modelSummary,
	onSelect,
	onDelete,
	onRename,
}: FitConfigurationCardModel) {
	return (
		<Box
			role="button"
			tabIndex={0}
			flex="0 0 8.75rem"
			minW={0}
			borderWidth="1px"
			borderRadius="md"
			borderColor={selected ? "cyan.400" : "border.muted"}
			bg={selected ? "cyan.subtle" : "bg"}
			px={2}
			py={2}
			cursor="pointer"
			transition="border-color 0.15s ease, background 0.15s ease"
			_hover={{ borderColor: selected ? "cyan.400" : "border.emphasized" }}
			onClick={() => onSelect(id)}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onSelect(id);
				}
			}}
		>
			<Stack gap={1}>
				<HStack gap={1} align="center">
					<Input
						size="2xs"
						value={name}
						fontWeight="semibold"
						px={1}
						onClick={(event) => event.stopPropagation()}
						onChange={(event) => onRename(id, event.currentTarget.value)}
					/>
					<Tooltip content="Delete configuration">
						<IconButton
							aria-label={`Delete ${name}`}
							size="2xs"
							variant="ghost"
							colorPalette="red"
							flex="0 0 auto"
							onClick={(event) => {
								event.stopPropagation();
								onDelete(id);
							}}
						>
							<Trash2 size={13} />
						</IconButton>
					</Tooltip>
				</HStack>
				<Text fontSize="2xs" color="fg.muted" lineClamp={1}>
					{modelSummary}
				</Text>
			</Stack>
		</Box>
	);
}
