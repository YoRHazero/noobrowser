import {
	Box,
	Button,
	HStack,
	NumberInput,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import CustomSourceStatus from "./components/CustomSourceStatus";
import { useCustomSource } from "./hooks/useCustomSource";
import { customSourceRecipe } from "./recipes/custom-source.recipe";

export default function CustomSource() {
	const {
		enabled,
		setEnabled,
		ra,
		setRa,
		dec,
		setDec,
		apertureSize,
		setApertureSize,
		forwardWaveRange,
		setForwardWaveRange,
		isReady,
		isFetching,
		isError,
		isSuccess,
		data,
		isDisplayed,
		handleExtract,
	} = useCustomSource();

	// Use custom source recipe
	const recipe = useSlotRecipe({ recipe: customSourceRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root} borderBottomWidth="1px" borderColor="border.subtle">
			<SectionHeader
				title="Custom Source"
				tip="Manually extract spectrum by coordinates."
				rightSlot={
					<Tooltip content={enabled ? "Disable Manual Mode" : "Enable Manual Mode"}>
						{/* Wrap Switch in a Box so Tooltip can attach ref to a visible element */}
						<Box display="inline-flex">
							<Switch
								colorPalette="cyan"
								size="sm"
								checked={enabled}
								onCheckedChange={(e) => setEnabled(e.checked)}
							/>
						</Box>
					</Tooltip>
				}
			/>

			<Stack gap={2} px={4} pb={4}>
				{/* Row 1: RA and Dec */}
				<HStack gap={2}>
					<Stack gap={0} flex={1}>
						<Text css={styles.label}>RA (deg)</Text>
						<NumberInput.Root
							size="xs"
							disabled={!enabled}
							value={ra === undefined ? "" : ra.toString()}
							onValueChange={(e) =>
								setRa(e.value === "" ? undefined : Number(e.value))
							}
						>
							<NumberInput.Control css={styles.controlBase} />
							<NumberInput.Input css={styles.input} placeholder="ra" />
						</NumberInput.Root>
					</Stack>
					<Stack gap={0} flex={1}>
						<Text css={styles.label}>Dec (deg)</Text>
						<NumberInput.Root
							size="xs"
							disabled={!enabled}
							value={dec === undefined ? "" : dec.toString()}
							onValueChange={(e) =>
								setDec(e.value === "" ? undefined : Number(e.value))
							}
						>
							<NumberInput.Control css={styles.controlBase} />
							<NumberInput.Input css={styles.input} placeholder="dec" />
						</NumberInput.Root>
					</Stack>
				</HStack>

				{/* Row 2: Settings (Editable) */}
				<HStack gap={2}>
					<Stack gap={0} flex={1}>
						<Text css={styles.label}>Aperture (px)</Text>
						<NumberInput.Root
							size="xs"
							value={apertureSize.toString()}
							disabled={!enabled}
							onValueChange={(e) => setApertureSize(Number(e.value))}
						>
							<NumberInput.Control css={styles.controlBase} />
							<NumberInput.Input css={styles.input} />
						</NumberInput.Root>
					</Stack>
					<Stack gap={0} flex={1}>
						<Text css={styles.label}>Wave Range (µm)</Text>
						<HStack gap={1}>
							<NumberInput.Root
								size="xs"
								value={forwardWaveRange.min.toString()}
								disabled={!enabled}
								onValueChange={(e) =>
									setForwardWaveRange({ min: Number(e.value) })
								}
							>
								<NumberInput.Control css={styles.controlBase} />
								<NumberInput.Input css={styles.input} />
							</NumberInput.Root>
							<Text fontSize="xs" color="fg.subtle">
								-
							</Text>
							<NumberInput.Root
								size="xs"
								value={forwardWaveRange.max.toString()}
								disabled={!enabled}
								onValueChange={(e) =>
									setForwardWaveRange({ max: Number(e.value) })
								}
							>
								<NumberInput.Control css={styles.controlBase} />
								<NumberInput.Input css={styles.input} />
							</NumberInput.Root>
						</HStack>
					</Stack>
				</HStack>

				{/* Row 3: Action */}
				<HStack justify="space-between">
					<CustomSourceStatus
						enabled={enabled}
						isFetching={isFetching}
						isError={isError}
						isSuccess={isSuccess}
						data={data}
						isDisplayed={isDisplayed}
					/>
					<Button
						size="xs"
						variant="surface"
						colorPalette="cyan"
						px={2}
						disabled={!enabled || !isReady || isFetching}
						loading={isFetching}
						onClick={handleExtract}
					>
						<Play size={10} style={{ marginRight: 2 }} />
						Extract
					</Button>
				</HStack>
			</Stack>
		</Stack>
	);
}
