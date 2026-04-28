import { Button, Input, NumberInput, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

export interface AddLineRowProps {
	onAddEmissionLine: (name: string, restWavelengthUm: number) => void;
}

export function AddLineRow({ onAddEmissionLine }: AddLineRowProps) {
	const [nameDraft, setNameDraft] = useState("");
	const [restWavelengthDraft, setRestWavelengthDraft] = useState("");
	const sanitizedName = useMemo(
		() => nameDraft.trim().replace(/\s+/g, " "),
		[nameDraft],
	);
	const parsedRestWavelength = Number.parseFloat(restWavelengthDraft);
	const canAdd =
		sanitizedName.length > 0 &&
		Number.isFinite(parsedRestWavelength) &&
		parsedRestWavelength > 0;

	return (
		<Stack gap={3}>
			<Text fontSize="sm" fontWeight="semibold">
				Add Line
			</Text>
			<Stack direction={{ base: "column", md: "row" }} gap={3} align="end">
				<Stack flex="1" gap={1} minW={0}>
					<Text fontSize="xs" fontWeight="medium" color="fg.muted">
						Name
					</Text>
					<Input
						size="xs"
						value={nameDraft}
						placeholder="e.g. [OIII]"
						onChange={(event) => setNameDraft(event.currentTarget.value)}
					/>
				</Stack>

				<Stack flex="1" gap={1} minW={0}>
					<Text fontSize="xs" fontWeight="medium" color="fg.muted">
						Rest λ (um)
					</Text>
					<NumberInput.Root
						size="xs"
						min={0}
						step={0.0001}
						value={restWavelengthDraft}
						onValueChange={({ value }) => setRestWavelengthDraft(value)}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>
				</Stack>

				<Button
					size="xs"
					alignSelf={{ base: "stretch", md: "end" }}
					disabled={!canAdd}
					onClick={() => {
						if (!canAdd) {
							return;
						}

						onAddEmissionLine(sanitizedName, parsedRestWavelength);
						setNameDraft("");
						setRestWavelengthDraft("");
					}}
				>
					Add
				</Button>
			</Stack>
		</Stack>
	);
}
