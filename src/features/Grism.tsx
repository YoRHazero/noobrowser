import { Accordion, Span } from "@chakra-ui/react";
import GrismBackward from "@/features/grism/GrismBackward";
import GrismForward from "@/features/grism/GrismForward";
export default function Grism() {
	const items = [
		{ value: "forward", title: "Grism Forward", item: <GrismForward /> },
		{
			value: "backward",
			title: "Grism Backward",
			item: <GrismBackward />,
		},
	];
	return (
		<Accordion.Root multiple defaultValue={["forward", "backward"]}>
			{items.map((item) => (
				<Accordion.Item key={`item-${item.value}`} value={item.value}>
					<Accordion.ItemTrigger>
						<Span fontSize={"large"}>{item.title}</Span>
						<Accordion.ItemIndicator />
					</Accordion.ItemTrigger>
					<Accordion.ItemContent>
						<Accordion.ItemBody>{item.item}</Accordion.ItemBody>
					</Accordion.ItemContent>
				</Accordion.Item>
			))}
		</Accordion.Root>
	);
}
