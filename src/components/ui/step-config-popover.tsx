import {
	Button,
	HStack,
	NumberInput,
	Popover,
	Portal,
	Stack,
	Text,
} from "@chakra-ui/react";
import { LuSettings2 } from "react-icons/lu";

export interface StepControlItem {
	key: string;
	label: string;
	value: number;
	onChange: (value: number) => void;
}

interface StepConfigPopoverProps {
	controls: StepControlItem[];
	disabled?: boolean;
}

export function StepConfigPopover(props: StepConfigPopoverProps) {
	const { controls, disabled } = props;

	if (!controls.length) return null;

	// Trigger button appearance
	const TriggerButton = (
		<Button size="xs" variant="ghost" disabled={disabled}>
			<LuSettings2 />
			<Text as="span" ml="1" textStyle="xs">
				step set
			</Text>
		</Button>
	);

	if (disabled) {
		return TriggerButton;
	}

	return (
		<Popover.Root positioning={{ placement: "bottom-end" }}>
			<Popover.Trigger asChild>{TriggerButton}</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content minW="200px">
						<Popover.Body p={2}>
							<Stack gap={2}>
								<Text textStyle="xs" fontWeight="semibold" color="fg.muted">
									Adjust Step Sizes
								</Text>
								{controls.map((control) => (
									<HStack
										key={control.key}
										justify="space-between"
										align="center"
										gap={3}
									>
										<Text textStyle="xs">{control.label}</Text>
										<NumberInput.Root
											size="xs"
											maxW="80px"
											// Use a simplified formatting for steps
											value={
												Number.isFinite(control.value)
													? control.value.toString()
													: "0.1"
											}
											step={control.value || 0.1}
											onValueChange={({ valueAsNumber }) => {
												if (Number.isFinite(valueAsNumber)) {
													control.onChange(valueAsNumber);
												}
											}}
										>
											<NumberInput.Input />
										</NumberInput.Root>
									</HStack>
								))}
							</Stack>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}