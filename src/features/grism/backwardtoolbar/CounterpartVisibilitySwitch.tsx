import { HStack, Switch, Text } from "@chakra-ui/react";
import { useGrismStore } from "@/stores/image";

export default function CounterpartVisibilitySwitch() {
	const counterpartVisible = useGrismStore((state) => state.counterpartVisible);
	const setCounterpartVisible = useGrismStore(
		(state) => state.setCounterpartVisible,
	);
	return (
		<HStack gap={2}>
			<Text fontSize="xs" color={counterpartVisible ? "pink.400" : "gray.500"}>
				Counterpart: {counterpartVisible ? "Visible" : "Hidden"}
			</Text>
			<Switch.Root
				size="sm"
				colorPalette="pink"
				checked={counterpartVisible}
				onCheckedChange={(e) => setCounterpartVisible(e.checked)}
			>
				<Switch.HiddenInput />
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
			</Switch.Root>
		</HStack>
	);
}
