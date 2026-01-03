import {
	Box,
	Button,
	HStack,
	NumberInput,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Stamp, Trash2 } from "lucide-react";

import { Tooltip } from "@/components/ui/tooltip";
import { footerStyle } from "../../styles";
import type { GlobalSettings, SetSettings } from "../../types";

export default function GlobalControlsView(props: {
	settings: GlobalSettings;
	setSettings: SetSettings;
	isValid: boolean;
	hasSources: boolean;
	totalSources: number;
	mainTraceSourceId: string | null;
	onClearAll: () => void;
	onApplyRoi: () => void;
}) {
	const {
		settings,
		setSettings,
		isValid,
		hasSources,
		totalSources,
		mainTraceSourceId,
		onClearAll,
		onApplyRoi,
	} = props;

	return (
		<Box borderTop={footerStyle.borderTop} bg={footerStyle.bg} p={4}>
			<Stack gap={3}>
				<HStack gap={4}>
					<Stack gap={1} flex={1}>
						<Text fontSize="xs" color="gray.400">
							Aperture (px)
						</Text>
						<NumberInput.Root
							size="sm"
							value={settings.apertureSize.toString()}
							onValueChange={(e) => {
								const val = parseInt(e.value, 10);
								if (!Number.isNaN(val) && val > 1) {
									setSettings((s) => ({ ...s, apertureSize: val }));
								}
							}}
							min={2}
						>
							<NumberInput.Input
								bg="whiteAlpha.100"
								color="white"
								borderColor="gray.700"
							/>
						</NumberInput.Root>
					</Stack>

					<Stack gap={1} flex={2}>
						<Text fontSize="xs" color="gray.400">
							Range (µm)
						</Text>
						<HStack>
							<NumberInput.Root
								size="sm"
								value={settings.waveMin.toString()}
								onValueChange={(e) =>
									setSettings((s) => ({ ...s, waveMin: parseFloat(e.value) }))
								}
								step={0.1}
							>
								<NumberInput.Input
									bg="whiteAlpha.100"
									color="white"
									borderColor={isValid ? "gray.700" : "red.500"}
								/>
							</NumberInput.Root>

							<Text color="gray.500">-</Text>

							<NumberInput.Root
								size="sm"
								value={settings.waveMax.toString()}
								onValueChange={(e) =>
									setSettings((s) => ({ ...s, waveMax: parseFloat(e.value) }))
								}
								step={0.1}
							>
								<NumberInput.Input
									bg="whiteAlpha.100"
									color="white"
									borderColor={isValid ? "gray.700" : "red.500"}
								/>
							</NumberInput.Root>
						</HStack>
					</Stack>
				</HStack>

				{!isValid && (
					<Text fontSize="xs" color="red.400">
						Error: Min &gt;= Max
					</Text>
				)}

				<HStack justify={"space-between"}>
					<Text fontSize="xs" color="gray.600" w="100%" textAlign="center">
						Total Sources: {totalSources} | Main ID:{" "}
						{mainTraceSourceId ? mainTraceSourceId.slice(0, 6) : "None"}
					</Text>

					<HStack gap={2}>
						<Tooltip content="Sync all sources with current ROI settings">
							<Button
								size="sm"
								variant="surface"
								colorPalette="cyan"
								onClick={onApplyRoi}
								disabled={!hasSources}
							>
								<Stamp size={14} style={{ marginRight: 8 }} />
								Sync
							</Button>
						</Tooltip>

						<Tooltip content="Remove all sources">
							<Button
								size="sm"
								variant="surface"
								colorPalette="red"
								onClick={onClearAll}
								disabled={!hasSources}
							>
								<Trash2 size={14} style={{ marginRight: 8 }} />
								Clear
							</Button>
						</Tooltip>
					</HStack>
				</HStack>
			</Stack>
		</Box>
	);
}
