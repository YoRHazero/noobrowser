import { Box, Stack, Text } from "@chakra-ui/react";
import { EmissionLineRow, type EmissionLineRowProps } from "./EmissionLineRow";

export interface EmissionLineListProps {
	rows: EmissionLineRowProps[];
}

export function EmissionLineList({ rows }: EmissionLineListProps) {
	if (rows.length === 0) {
		return (
			<Stack h="full" minH={0} align="center" justify="center" px={4}>
				<Text fontSize="sm" color="fg.muted">
					No emission lines available.
				</Text>
			</Stack>
		);
	}

	return (
		<Box h="full" minH={0} overflowY="auto">
			{rows.map((row) => (
				<EmissionLineRow key={row.id} {...row} />
			))}
		</Box>
	);
}
