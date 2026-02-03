import { Badge, Box, Heading, HStack, Stack, Tabs, Text, VStack } from "@chakra-ui/react";
import type { FitResultPayload } from "@/hooks/query/fit/schemas";
import { useConnectionStore } from "@/stores/connection";
import { ResultImage } from "./ResultImage";

interface FitJobResultTabsProps {
	result: FitResultPayload;
}

export function FitJobResultTabs({ result }: FitJobResultTabsProps) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const { results, best_model_name: bestModelName } = result;

	const sortedModelNames = Object.keys(results).sort((a, b) => {
		if (a === bestModelName) return -1;
		if (b === bestModelName) return 1;
		return a.localeCompare(b);
	});

	return (
		<Tabs.Root defaultValue={sortedModelNames[0]} w="full">
			<Box px={4} pt={4} borderBottomWidth="1px" borderColor="whiteAlpha.200">
				<Tabs.List gap={2}>
					{sortedModelNames.map((modelName) => (
						<Tabs.Trigger
							key={modelName}
							value={modelName}
							px={3}
							py={2}
							_selected={{
								color: "cyan.400",
								borderColor: "cyan.400",
							}}
						>
							<HStack gap={2}>
								<Text>{modelName}</Text>
								{modelName === bestModelName && (
									<Badge colorPalette="green" size="xs" variant="solid">
										BEST
									</Badge>
								)}
							</HStack>
						</Tabs.Trigger>
					))}
				</Tabs.List>
			</Box>

			<Box p={4}>
				{sortedModelNames.map((modelName) => {
					const modelResult = results[modelName];
					const fitPlotUrl = `${backendUrl}${modelResult.plot_file_url}`;
					const posteriorPlotUrl = `${backendUrl}${modelResult.plot_posterior_url}`;

					return (
						<Tabs.Content key={modelName} value={modelName}>
							<VStack align="stretch" gap={6}>
								{/* Metrics Block */}
								<Box
									bg="whiteAlpha.50"
									p={4}
									borderRadius="md"
									borderWidth="1px"
									borderColor="whiteAlpha.100"
								>
									<Stack gap={3}>
										<Heading size="xs" color="gray.400">
											Metrics
										</Heading>
										<HStack gap={8}>
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
													{modelResult.waic.toFixed(2)}
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
													{modelResult.waic_se.toFixed(2)}
												</Text>
											</Stack>
											<Stack gap={0}>
												<Text fontSize="2xs" color="gray.500">
													TRACE FILE
												</Text>
												<Text
													fontSize="xs"
													fontFamily="mono"
													color="gray.500"
												>
													{modelResult.trace_filename}
												</Text>
											</Stack>
										</HStack>
									</Stack>
								</Box>

								{/* Nested Tabs: Plot Type Selection */}
								<Tabs.Root defaultValue="fit" variant="enclosed" fitted>
									<Tabs.List>
										<Tabs.Trigger value="fit">Fit Plot</Tabs.Trigger>
										<Tabs.Trigger value="posterior">
											Posterior Plot
										</Tabs.Trigger>
									</Tabs.List>
									<Box mt={4}>
										<Tabs.Content value="fit">
											<ResultImage title="Model Fit" url={fitPlotUrl} />
										</Tabs.Content>
										<Tabs.Content value="posterior">
											<ResultImage
												title="Posterior Distribution"
												url={posteriorPlotUrl}
											/>
										</Tabs.Content>
									</Box>
								</Tabs.Root>
							</VStack>
						</Tabs.Content>
					);
				})}
			</Box>
		</Tabs.Root>
	);
}
