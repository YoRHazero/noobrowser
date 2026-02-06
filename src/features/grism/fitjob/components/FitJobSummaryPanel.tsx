import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	Stack,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import type { FitJobSummary } from "../types";

interface FitJobSummaryPanelProps {
	summary: FitJobSummary;
	selectedModelName?: string | null;
	onSelectModelName?: (modelName: string) => void;
}

const formatNumber = (value: number | null, digits = 4) => {
	if (value === null || Number.isNaN(value)) return "-";
	return value.toFixed(digits);
};

export function FitJobSummaryPanel({
	summary,
	selectedModelName,
	onSelectModelName,
}: FitJobSummaryPanelProps) {
	return (
		<VStack align="stretch" gap={4}>
			<Box
				bg="whiteAlpha.50"
				p={4}
				borderRadius="md"
				borderWidth="1px"
				borderColor="whiteAlpha.100"
			>
				<Stack gap={1}>
					<Heading size="xs" color="gray.400">
						Summary
					</Heading>
					<HStack gap={4} flexWrap="wrap">
						<Text fontSize="xs" color="gray.400">
							Job: {summary.job_id.slice(0, 8)}
						</Text>
						{summary.created_at && (
							<Text fontSize="xs" color="gray.400">
								Created: {summary.created_at}
							</Text>
						)}
						{summary.best_model_name && (
							<Text fontSize="xs" color="gray.400">
								Best: {summary.best_model_name}
							</Text>
						)}
					</HStack>
				</Stack>
			</Box>

			{summary.results.map((model) => (
				<Box
					key={model.model_name}
					bg="whiteAlpha.50"
					p={4}
					borderRadius="md"
					borderWidth="1px"
					borderColor={
						selectedModelName === model.model_name
							? "cyan.300"
							: "whiteAlpha.100"
					}
				>
					<Stack gap={3}>
						<HStack justify="space-between" align="center">
							<HStack gap={2}>
								<Heading size="xs" color="cyan.200">
									{model.model_name}
								</Heading>
								{model.is_best && (
									<Badge colorPalette="green" size="xs" variant="solid">
										BEST
									</Badge>
								)}
								{selectedModelName === model.model_name && (
									<Badge colorPalette="cyan" size="xs" variant="solid">
										PLOTTING
									</Badge>
								)}
							</HStack>
							<HStack gap={6} align="center">
								{onSelectModelName && (
									<Button
										size="xs"
										variant="outline"
										colorPalette="cyan"
										onClick={() => onSelectModelName(model.model_name)}
										disabled={selectedModelName === model.model_name}
									>
										Use for plots
									</Button>
								)}
								<Stack gap={0}>
									<Text fontSize="2xs" color="gray.500">
										WAIC
									</Text>
									<Text
											fontSize="md"
											fontWeight="bold"
											fontFamily="mono"
											color="cyan.200"
										>
											{formatNumber(model.waic, 2)}
										</Text>
								</Stack>
								<Stack gap={0}>
									<Text fontSize="2xs" color="gray.500">
										WAIC SE
									</Text>
									<Text
											fontSize="md"
											fontWeight="bold"
											fontFamily="mono"
											color="gray.300"
										>
											{formatNumber(model.waic_se, 2)}
										</Text>
								</Stack>
							</HStack>
						</HStack>

						<Table.Root size="sm" interactive>
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeader>Component</Table.ColumnHeader>
									<Table.ColumnHeader>Type</Table.ColumnHeader>
									<Table.ColumnHeader textAlign="right">
										Amplitude
									</Table.ColumnHeader>
									<Table.ColumnHeader textAlign="right">
										FWHM (km/s)
									</Table.ColumnHeader>
									<Table.ColumnHeader textAlign="right">
										Center
									</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{model.components.map((component) => (
									<Table.Row key={`${model.model_name}-${component.name}`}>
										<Table.Cell>
											<Stack gap={0}>
												<Text fontSize="xs" fontWeight="medium">
													{component.name}
												</Text>
												{component.physical_name && (
													<Text fontSize="2xs" color="gray.500">
														{component.physical_name}
													</Text>
												)}
											</Stack>
										</Table.Cell>
										<Table.Cell>
											<Text fontSize="xs" color="gray.400">
												{component.component_type}
											</Text>
										</Table.Cell>
										<Table.Cell textAlign="right">
											<Text fontSize="xs" fontFamily="mono">
												{formatNumber(component.amplitude)}
											</Text>
											<Text fontSize="2xs" color="gray.500">
												± {formatNumber(component.amplitude_error)}
											</Text>
										</Table.Cell>
										<Table.Cell textAlign="right">
											<Text fontSize="xs" fontFamily="mono">
												{formatNumber(component.fwhm_kms)}
											</Text>
											<Text fontSize="2xs" color="gray.500">
												± {formatNumber(component.fwhm_kms_error)}
											</Text>
										</Table.Cell>
										<Table.Cell textAlign="right">
											<Text fontSize="xs" fontFamily="mono">
												{formatNumber(component.center)}
											</Text>
											<Text fontSize="2xs" color="gray.500">
												± {formatNumber(component.center_error)}
											</Text>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Stack>
				</Box>
			))}
		</VStack>
	);
}
