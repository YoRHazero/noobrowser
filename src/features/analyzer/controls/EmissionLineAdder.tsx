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
	useSlotRecipe,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useEmissionLineAdder } from "./hooks/useEmissionLineAdder";
import { emissionLineAdderRecipe } from "./recipes/emission-line-adder.recipe";

export function EmissionLineAdder() {
	const recipe = useSlotRecipe({ recipe: emissionLineAdderRecipe });
	const styles = recipe();
	const {
		waveUnit,
		inputName,
		setInputName,
		inputWavelength,
		setInputWavelength,
		canAdd,
		handleAdd,
	} = useEmissionLineAdder();

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleAdd();
	};

	return (
		<Popover.Root positioning={{ placement: "bottom-end" }}>
			<Popover.Trigger asChild>
				<IconButton
					size="xs"
					variant="ghost"
					aria-label="Add emission line"
					css={styles.trigger}
				>
					<LuPlus />
				</IconButton>
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content css={styles.content}>
						<Popover.Arrow bg="transparent" />
						<Popover.Body p={3}>
							<Stack gap={3}>
								<Heading size="xs" css={styles.title}>
									Add New Line
								</Heading>

								<Stack gap={1}>
									<Text css={styles.label}>Name</Text>
									<Input
										size="sm"
										css={styles.input}
										placeholder="e.g. H⍺"
										value={inputName}
										onChange={(e) => setInputName(e.target.value)}
										onKeyDown={handleKeyDown}
										autoFocus
									/>
								</Stack>

								<Stack gap={1}>
									<Text css={styles.label}>Rest Wavelength ({waveUnit})</Text>
									<NumberInput.Root
										size="sm"
										value={inputWavelength}
										onValueChange={({ value }) => setInputWavelength(value)}
										step={waveUnit === "µm" ? 0.0001 : 1}
									>
										<NumberInput.Input
											css={styles.input}
											placeholder={waveUnit === "µm" ? "0.6563" : "6563"}
											onKeyDown={handleKeyDown}
										/>
									</NumberInput.Root>
								</Stack>

								<Button
									size="sm"
									colorPalette="cyan"
									variant="surface"
									css={styles.button}
									onClick={handleAdd}
									disabled={!canAdd}
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
