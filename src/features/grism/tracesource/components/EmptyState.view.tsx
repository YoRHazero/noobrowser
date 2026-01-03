import { Flex, Text } from "@chakra-ui/react";
import { Target } from "lucide-react";

export default function EmptyStateView() {
	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			h="200px"
			color="gray.500"
		>
			<Target size={40} style={{ opacity: 0.5, marginBottom: 10 }} />
			<Text fontSize="sm">No trace sources.</Text>
		</Flex>
	);
}
