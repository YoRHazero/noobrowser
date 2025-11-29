import {
    Accordion,
    Span
} from "@chakra-ui/react";
import GrismForward from "@/features/grism/GrismForward";

export default function Grism() {
    const items = [
        { value: 'forward', title : 'Grism Forward', item: <GrismForward /> },
        { value: 'backward', title : 'Grism Backward', item: <div>Backward Placeholder</div>},
    ]
    return (
        <Accordion.Root multiple defaultValue={['forward', 'backward']} lazyMount={true}>
            {items.map((item, index) => (
                <Accordion.Item 
                    key={index}
                    value={item.value}
                >
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
    )
}