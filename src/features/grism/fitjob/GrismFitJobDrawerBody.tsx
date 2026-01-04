
import {
    Box,
    Flex,
    Heading,
    HStack,
    Stack,
    Tabs,
    Text,
    Image,
    Link,
    Button,
    VStack,
    Drawer,
    Badge,
} from "@chakra-ui/react";
import { Info, ExternalLink } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitJobResponse } from "@/hook/connection-hook";
import { useConnectionStore } from "@/stores/connection";

/* -------------------------------------------------------------------------- */
/*                            Sub-Component: ResultImage                      */
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
					maxH="500px" 
				/>
			</Box>
		</Stack>
	);
}

interface GrismFitJobDrawerBodyProps {
    selectedJob: FitJobResponse | undefined;
}

export default function GrismFitJobDrawerBody({ selectedJob }: GrismFitJobDrawerBodyProps) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);

    if (!selectedJob) {
        return (
             <Drawer.Body pt={0} px={0} className="custom-scrollbar" bg="blackAlpha.200">
                <Flex direction="column" align="center" justify="center" h="full" color="gray.500">
                    <Info size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <Text>Select a completed job to view results.</Text>
                </Flex>
            </Drawer.Body>
        );
    }
    
    if (!selectedJob.result) {
        return (
            <Drawer.Body pt={0} px={0} className="custom-scrollbar" bg="blackAlpha.200">
                <Flex direction="column" align="center" justify="center" h="full" color="gray.500">
                    <Text>No results available for this job.</Text>
                </Flex>
            </Drawer.Body>
        );
    }

    const { results, best_model_name: bestModelName } = selectedJob.result;
    const sortedModelNames = Object.keys(results).sort((a, b) => {
        if (a === bestModelName) return -1;
        if (b === bestModelName) return 1;
        return a.localeCompare(b);
    });

    return (
        <Drawer.Body pt={0} px={0} className="custom-scrollbar" bg="blackAlpha.200">
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
                        const result = results[modelName];
                        const fitPlotUrl = `${backendUrl}${result.plot_file_url}`;
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
        </Drawer.Body>
    );
}
