import { Accordion, Span } from "@chakra-ui/react";
import GrismForward from "@/features/grism/GrismForward";
import GrismInspector from "@/features/grism/GrismInspector";
export default function Grism() {
	const items = [
		{ value: "forward", title: "Grism Forward", item: <GrismForward /> },
		{
			value: "backward",
			title: "Grism Backward",
			item: <GrismInspector />,
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
