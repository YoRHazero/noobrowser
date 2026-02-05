import { Drawer, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { useJobDetail } from "../hooks/useJobDetail";
import { FitJobSummaryPanel } from "./FitJobSummaryPanel";
import { FitJobPlotsTabs } from "./FitJobPlotsTabs";

export default function JobDetailView() {
	const { selectedJob, status, summary, summaryLoading, summaryError, plots } =
		useJobDetail();
	if (!selectedJob || !status) {
		return (
			<Drawer.Body
				pt={0}
				px={0}
				className="custom-scrollbar"
				bg="blackAlpha.200"
			>
				<Flex
					direction="column"
					align="center"
					justify="center"
					h="full"
					color="gray.500"
				>
					<Info size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
					<Text>Select a job to view results.</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	if (status === "pending" || status === "processing") {
		return (
			<Drawer.Body
				pt={0}
				px={0}
				className="custom-scrollbar"
				bg="blackAlpha.200"
			>
				<Flex
					direction="column"
					align="center"
					justify="center"
					h="full"
					color="gray.400"
					gap={3}
				>
					<Spinner size="lg" color="cyan.300" />
					<Text>Job is {status}...</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	if (status === "failed") {
		return (
			<Drawer.Body
				pt={0}
				px={0}
				className="custom-scrollbar"
				bg="blackAlpha.200"
			>
				<Flex
					direction="column"
					align="center"
					justify="center"
					h="full"
					color="red.300"
					textAlign="center"
					px={6}
				>
					<Text fontWeight="semibold" mb={2}>
						Job failed
					</Text>
					<Text fontSize="sm">
						{selectedJob.error || "An unknown error occurred."}
					</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	return (
		<Drawer.Body pt={0} px={0} className="custom-scrollbar" bg="blackAlpha.200">
			<VStack align="stretch" gap={6} p={4}>
				{summaryLoading && (
					<Flex align="center" gap={3} color="gray.400">
						<Spinner size="sm" color="cyan.300" />
						<Text>Loading summary...</Text>
					</Flex>
				)}
				{summaryError && (
					<Text color="red.400" fontSize="sm">
						{summaryError}
					</Text>
				)}
				{summary && <FitJobSummaryPanel summary={summary} />}
				{plots.length > 0 && <FitJobPlotsTabs plots={plots} />}
			</VStack>
		</Drawer.Body>
	);
}
