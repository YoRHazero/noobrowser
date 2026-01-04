
import {
	Badge,
	Box,
	Button,
	CloseButton,
	Drawer,
	Flex,
	Heading,
	HStack,
	Image,
	Link,
	Stack,
	Tabs,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useConnectionStore } from "@/stores/connection";
import type { SingleModelFitResult } from "@/hook/connection-hook";
import { ExternalLink, Info } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

/* -------------------------------------------------------------------------- */
/*                            Sub-Component: Image                            */
/* -------------------------------------------------------------------------- */
interface ResultImageProps {
	title: string;
	url: string;
}

function ResultImage({ title, url }: ResultImageProps) {
	return (
		<Stack gap={2} h="full">
			<HStack justify="space-between" align="center">
				<Heading size="xs" color="gray.400">
					{title}
				</Heading>
				<Tooltip content="Open image in new tab">
					<Link href={url} target="_blank">
						<Button size="xs" variant="ghost" colorPalette="cyan">
							<ExternalLink size={14} /> Open URL
						</Button>
					</Link>
				</Tooltip>
			</HStack>
			<Box
				borderRadius="md"
				overflow="hidden"
				borderWidth="1px"
				borderColor="whiteAlpha.200"
				bg="black"
				flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
			>
				<Image
					src={url}
					alt={title}
					objectFit="contain"
					w="full"
					maxH="600px" // Reasonable height cap
				/>
			</Box>
		</Stack>
	);
}

/* -------------------------------------------------------------------------- */
/*                             Main Drawer Component                          */
/* -------------------------------------------------------------------------- */
interface FitResultsDrawerProps {
	results: Record<string, SingleModelFitResult>;
	bestModelName: string;
	children: React.ReactNode;
}

export default function FitResultsDrawer({
	results,
	bestModelName,
	children,
}: FitResultsDrawerProps) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const sortedModelNames = Object.keys(results).sort((a, b) => {
		// Put best model first
		if (a === bestModelName) return -1;
		if (b === bestModelName) return 1;
		return a.localeCompare(b);
	});

	return (
		<Drawer.Root placement="end" size="lg">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>{children}</Drawer.Trigger>
			<Drawer.Positioner>
				<Drawer.Content bg="#09090b" borderLeft="1px solid #333">
					<Drawer.Header borderBottom="1px solid #222" pb={4}>
						<HStack justify="space-between">
							<HStack>
								<Info color="cyan" />
								<Heading size="sm" color="white">
									Fit Results
								</Heading>
							</HStack>
							<Drawer.CloseTrigger asChild>
								<CloseButton size="md" />
							</Drawer.CloseTrigger>
						</HStack>
					</Drawer.Header>
					<Drawer.Body pt={0} px={0} className="custom-scrollbar">
						{sortedModelNames.length === 0 ? (
							<Flex
								direction="column"
								align="center"
								justify="center"
								h="200px"
								color="gray.500"
							>
								<Text fontSize="sm">No fit results available.</Text>
							</Flex>
						) : (
							<Tabs.Root defaultValue={sortedModelNames[0]} w="full">
                                {/* Top Level Tabs: Model Selection */}
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
										const result = results[modelName];
										const fitPlotUrl = `${backendUrl}${result.plot_file_url}`;
                                        // plot_posterior_url is mandatory now per user request
										const posteriorPlotUrl = `${backendUrl}${result.plot_posterior_url}`;

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
																		{result.waic.toFixed(2)}
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
																		{result.waic_se.toFixed(2)}
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
																		{result.trace_filename}
																	</Text>
																</Stack>
															</HStack>
														</Stack>
													</Box>

													{/* Nested Tabs: Plot Type Selection */}
                                                    <Tabs.Root defaultValue="fit" variant="enclosed" fitted>
                                                        <Tabs.List>
                                                            <Tabs.Trigger value="fit">
                                                                Fit Plot
                                                            </Tabs.Trigger>
                                                            <Tabs.Trigger value="posterior">
                                                                Posterior Plot
                                                            </Tabs.Trigger>
                                                        </Tabs.List>
                                                        <Box mt={4}>
                                                            <Tabs.Content value="fit">
                                                                <ResultImage title="Model Fit" url={fitPlotUrl} />
                                                            </Tabs.Content>
                                                            <Tabs.Content value="posterior">
                                                                <ResultImage title="Posterior Distribution" url={posteriorPlotUrl} />
                                                            </Tabs.Content>
                                                        </Box>
                                                    </Tabs.Root>
												</VStack>
											</Tabs.Content>
										);
									})}
								</Box>
							</Tabs.Root>
						)}
					</Drawer.Body>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
