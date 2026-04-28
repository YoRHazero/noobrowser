import {
	Box,
	createListCollection,
	NumberInput,
	Portal,
	Select,
	Stack,
	Tabs,
	Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {
	SpectrumWorkspaceWavelengthFrame,
	SpectrumWorkspaceWavelengthUnit,
} from "../shared/types";

const wavelengthFrameCollection = createListCollection({
	items: [
		{ label: "Observed", value: "observed" },
		{ label: "Rest", value: "rest" },
	],
});

const wavelengthUnitCollection = createListCollection({
	items: [
		{ label: "um", value: "um" },
		{ label: "A", value: "angstrom" },
	],
});

function renderSelectContent(
	items: readonly { label: string; value: string }[],
) {
	return items.map((item) => (
		<Select.Item key={item.value} item={item}>
			<Select.ItemText>{item.label}</Select.ItemText>
			<Select.ItemIndicator />
		</Select.Item>
	));
}

export interface SpectrumWorkspaceSidebarProps {
	sourceName: string;
	redshift: number;
	redshiftStep: number;
	wavelengthFrame: SpectrumWorkspaceWavelengthFrame;
	wavelengthUnit: SpectrumWorkspaceWavelengthUnit;
	onRedshiftChange: (redshift: number) => void;
	onRedshiftStepChange: (redshiftStep: number) => void;
	onWavelengthFrameChange: (
		wavelengthFrame: SpectrumWorkspaceWavelengthFrame,
	) => void;
	onWavelengthUnitChange: (
		wavelengthUnit: SpectrumWorkspaceWavelengthUnit,
	) => void;
	linesSection: ReactNode;
	fitSection: ReactNode;
}

export function SpectrumWorkspaceSidebar({
	sourceName,
	redshift,
	redshiftStep,
	wavelengthFrame,
	wavelengthUnit,
	onRedshiftChange,
	onRedshiftStepChange,
	onWavelengthFrameChange,
	onWavelengthUnitChange,
	linesSection,
	fitSection,
}: SpectrumWorkspaceSidebarProps) {
	return (
		<Stack h="full" minH={0} gap={0}>
			<Stack
				gap={4}
				px={4}
				py={4}
				borderBottomWidth="1px"
				borderColor="border.muted"
				bg="bg.subtle"
			>
				<Stack gap={1}>
					<Text fontSize="xs" fontWeight="medium" color="fg.muted">
						Source
					</Text>
					<Text
						fontSize="sm"
						fontWeight="semibold"
						lineClamp={1}
						title={sourceName}
					>
						{sourceName}
					</Text>
				</Stack>

				<Box
					display="grid"
					gridTemplateColumns={{ base: "repeat(2, minmax(0, 1fr))" }}
					gap={3}
				>
					<Stack gap={1}>
						<Text fontSize="xs" fontWeight="medium" color="fg.muted">
							Redshift
						</Text>
						<NumberInput.Root
							size="xs"
							value={redshift.toFixed(4).replace(/\.?0+$/, "")}
							step={redshiftStep}
							onValueChange={({ valueAsNumber }) => {
								if (!Number.isNaN(valueAsNumber)) {
									onRedshiftChange(valueAsNumber);
								}
							}}
						>
							<NumberInput.Control />
							<NumberInput.Input />
						</NumberInput.Root>
					</Stack>

					<Stack gap={1}>
						<Text fontSize="xs" fontWeight="medium" color="fg.muted">
							Step
						</Text>
						<NumberInput.Root
							size="xs"
							min={0.0001}
							step={0.0005}
							value={redshiftStep.toFixed(4).replace(/\.?0+$/, "")}
							onValueChange={({ valueAsNumber }) => {
								if (!Number.isNaN(valueAsNumber)) {
									onRedshiftStepChange(valueAsNumber);
								}
							}}
						>
							<NumberInput.Control />
							<NumberInput.Input />
						</NumberInput.Root>
					</Stack>

					<Stack gap={1}>
						<Text fontSize="xs" fontWeight="medium" color="fg.muted">
							Frame
						</Text>
						<Select.Root
							collection={wavelengthFrameCollection}
							size="xs"
							value={[wavelengthFrame]}
							onValueChange={({ value }) => {
								const nextValue = value[0];
								if (nextValue === "observed" || nextValue === "rest") {
									onWavelengthFrameChange(nextValue);
								}
							}}
						>
							<Select.HiddenSelect />
							<Select.Control>
								<Select.Trigger>
									<Select.ValueText placeholder="Frame" />
									<Select.Indicator />
								</Select.Trigger>
							</Select.Control>
							<Portal>
								<Select.Positioner>
									<Select.Content>
										{renderSelectContent(wavelengthFrameCollection.items)}
									</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>
					</Stack>

					<Stack gap={1}>
						<Text fontSize="xs" fontWeight="medium" color="fg.muted">
							Unit
						</Text>
						<Select.Root
							collection={wavelengthUnitCollection}
							size="xs"
							value={[wavelengthUnit]}
							onValueChange={({ value }) => {
								const nextValue = value[0];
								if (nextValue === "um" || nextValue === "angstrom") {
									onWavelengthUnitChange(nextValue);
								}
							}}
						>
							<Select.HiddenSelect />
							<Select.Control>
								<Select.Trigger>
									<Select.ValueText placeholder="Unit" />
									<Select.Indicator />
								</Select.Trigger>
							</Select.Control>
							<Portal>
								<Select.Positioner>
									<Select.Content>
										{renderSelectContent(wavelengthUnitCollection.items)}
									</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>
					</Stack>
				</Box>
			</Stack>

			<Box flex="1" minH={0}>
				<Tabs.Root
					defaultValue="fit"
					display="flex"
					flexDirection="column"
					h="full"
					minH={0}
				>
					<Tabs.List px={4} borderBottomWidth="1px" borderColor="border.muted">
						<Tabs.Trigger value="lines">Lines</Tabs.Trigger>
						<Tabs.Trigger value="fit">Fit</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="lines" flex="1" minH={0} p={0}>
						{linesSection}
					</Tabs.Content>
					<Tabs.Content value="fit" flex="1" minH={0} p={0}>
						{fitSection}
					</Tabs.Content>
				</Tabs.Root>
			</Box>
		</Stack>
	);
}
