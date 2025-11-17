"use client"

import { 
    Box, 
    type BoxProps,
    Field, 
    NumberInput,
    Stack,
    IconButton, 
} from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

type ExpandableBoxProps = BoxProps & {
    collapsedSize?: number | string;
    buttonPosition?: "top-left" | "left";
    initialExpanded?: boolean;
    children?: React.ReactNode;
}

function ExpandableBox(props: ExpandableBoxProps) {
    const {
        collapsedSize = "40px",
        buttonPosition = "left",
        initialExpanded = true,
        children,
        ...rest
    } = props;
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const direction = buttonPosition === "top-left" ? "column" : "row";
    
    return (
        <Box
            {...rest}
        >
            <Stack
                direction={direction}
                alignItems="flex-start"
                gapY={0}
                p={0}
                m={0}
                overflow="hidden"
                borderWidth="1px"
                borderRadius="md"
                bg="bg"
                height={isExpanded ? "auto" : collapsedSize}
                width={isExpanded ? "auto" : collapsedSize}
                transition="width 500ms ease, height 500ms ease"
            >
                <IconButton
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    size="sm"
                    variant="ghost"
                    m={0}
                    p={0}
                    width={collapsedSize}
                    height={collapsedSize}
                    onClick={() => setIsExpanded((e) => !e)}
                    zIndex={1}
                >
                    <Box
                        p={0}
                        m={0}
                        as={LuPlus}
                        transform={isExpanded ? "rotate(45deg)" : "rotate(0deg)"}
                        transition="transform 500ms ease"
                    />
                </IconButton>
                <Box
                    opacity={isExpanded ? 1 : 0}
                    pointerEvents={isExpanded ? "auto" : "none"}
                    transform={isExpanded ? "translateY(0)" : "translateY(4px)"}
                    transition="opacity 500ms ease"
                    zIndex={0}
                >
                    {children}
                </Box>
            </Stack>
        </Box>
    )
}

function PercentageInput(
    {
        label,
        value,
        onValueChange,
        width,
    }: {
        label: string;
        value: number;
        onValueChange: (value: number) => void;
        width: string;
    }
) {
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            <NumberInput.Root
                value={value.toString()}
                step={0.1}
                min={0}
                max={100}
                onValueChange={(details) => {
                    const val = details.valueAsNumber;
                    if (!isNaN(val)) {
                        onValueChange(val);
                    }
                }}
                width={width}
            >
                <NumberInput.Control>
                    <NumberInput.IncrementTrigger />
                    <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input />
            </NumberInput.Root>
        </Field.Root>
    );
}

export { ExpandableBox, PercentageInput };