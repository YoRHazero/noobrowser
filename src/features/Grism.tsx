import {
    Accordion,
    Span
} from "@chakra-ui/react";
import GrismForwardCanvas from "@/features/grism/GrismForwardCanvas";

export default function Grism() {
    const items = [
        { value: 'forward', title : 'Grism Forward', item: <GrismForwardCanvas /> },
        { value: 'backward', title : 'Grism Backward', item: <div>Backward View</div> },
    ]
    return (
        <Accordion.Root multiple defaultValue={['forward', 'backward']} >
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