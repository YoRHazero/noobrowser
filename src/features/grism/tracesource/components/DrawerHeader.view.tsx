import { CloseButton, Drawer, Heading, HStack } from "@chakra-ui/react";
import { Crosshair } from "lucide-react";

export default function DrawerHeaderView(props: { traceMode: boolean }) {
	const { traceMode } = props;

	return (
		<HStack justify="space-between">
			<HStack>
				<Crosshair color={traceMode ? "#00FFFF" : "gray"} />
				<Heading size="sm" color="white">
					Trace Sources
				</Heading>
			</HStack>
			<Drawer.CloseTrigger asChild>
				<CloseButton size="md" />
			</Drawer.CloseTrigger>
		</HStack>
	);
}
