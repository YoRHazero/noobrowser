import {
	Button,
	Heading,
	IconButton,
	Input,
	NumberInput,
	Popover,
	Portal,
	Stack,
	Text,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

// --- Theme Constants ---
const THEME_STYLES = {
	popoverContent: {
		width: "260px",
		bg: "bg.panel",
		borderColor: "border.subtle",
		backdropFilter: "blur(10px)",
		boxShadow: "xl",
		_dark: {
			bg: "rgba(20, 20, 25, 0.9)",
			borderColor: "whiteAlpha.200",
		},
	},
	label: {
		textStyle: "2xs",
		fontWeight: "bold",
		textTransform: "uppercase" as const,
		color: "fg.muted",
		letterSpacing: "0.05em",
	},
	input: {
		size: "sm" as const,
		fontFamily: "mono",
		bg: "blackAlpha.200",
		borderColor: "whiteAlpha.100",
		_focus: { borderColor: "cyan.500", bg: "blackAlpha.400" },
	},
};

interface EmissionLineAdderProps {
	waveUnit: string;
	inputName: string;
	setInputName: (val: string) => void;
	inputWavelength: string;
	setInputWavelength: (val: string) => void;
	canAdd: boolean;
	onAdd: () => void;
}

export function EmissionLineAdder({
	waveUnit,
	inputName,
	setInputName,
	inputWavelength,
	setInputWavelength,
	canAdd,
	onAdd,
}: EmissionLineAdderProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") onAdd();
	};

	return (
		<Popover.Root positioning={{ placement: "bottom-end" }}>
			<Popover.Trigger asChild>
				<IconButton
					size="xs"
					variant="ghost"
					color="cyan.400"
					_hover={{ bg: "cyan.900", color: "cyan.200" }}
					aria-label="Add emission line"
				>
					<LuPlus />
				</IconButton>
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content {...THEME_STYLES.popoverContent}>
						<Popover.Arrow bg="transparent" />
						<Popover.Body p={3}>
							<Stack gap={3}>
								<Heading size="xs" color="cyan.400" textTransform="uppercase">
									Add New Line
								</Heading>

								{/* Name Input */}
								<Stack gap={1}>
									<Text {...THEME_STYLES.label}>Name</Text>
									<Input
										{...THEME_STYLES.input}
										placeholder="e.g. H⍺"
										value={inputName}
										onChange={(e) => setInputName(e.target.value)}
										onKeyDown={handleKeyDown}
										autoFocus
									/>
								</Stack>

								{/* Wavelength Input */}
								<Stack gap={1}>
									<Text {...THEME_STYLES.label}>
										Rest Wavelength ({waveUnit})
									</Text>
									<NumberInput.Root
										size="sm"
										value={inputWavelength}
										onValueChange={({ value }) => setInputWavelength(value)}
										step={waveUnit === "µm" ? 0.0001 : 1}
									>
										<NumberInput.Input
											{...THEME_STYLES.input}
											placeholder={waveUnit === "µm" ? "0.6563" : "6563"}
											onKeyDown={handleKeyDown}
										/>
									</NumberInput.Root>
								</Stack>

								{/* Action Button */}
								<Button
									size="sm"
									colorPalette="cyan"
									width="full"
									onClick={onAdd}
									disabled={!canAdd}
									mt={1}
									variant="surface"
								>
									ADD LINE
								</Button>
							</Stack>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}
