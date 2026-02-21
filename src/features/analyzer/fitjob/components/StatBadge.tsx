import { Badge, HStack, Text } from "@chakra-ui/react";

export function StatBadge({
	label,
	value,
	color = "gray",
}: {
	label: string;
	value: string | number;
	color?: string;
}) {
	return (
		<Badge
			variant="subtle"
			colorPalette={color}
			px={2}
			py={1}
			borderRadius="md"
		>
			<HStack gap={1}>
				<Text fontWeight="normal" fontSize="xs" opacity={0.8}>
					{label}:
				</Text>
				<Text fontWeight="bold">{value}</Text>
			</HStack>
		</Badge>
	);
}
