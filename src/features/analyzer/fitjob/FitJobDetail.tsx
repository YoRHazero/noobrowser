import {
	Drawer,
	Flex,
	Spinner,
	Text,
	useSlotRecipe,
	VStack,
} from "@chakra-ui/react";
import { Info } from "lucide-react";
import { useFitJobDetail } from "./hooks/useFitJobDetail";
import { SummaryPanel } from "./components/SummaryPanel";
import { SourceInfo } from "./components/SourceInfo";
import FitJobVisuals from "./FitJobVisuals";
import { fitJobDrawerRecipe } from "./recipes/fit-job-drawer.recipe";

export default function FitJobDetail() {
	const {
		selectedJob,
		status,
		summary,
		summaryLoading,
		summaryError,
		selectedModelName,
		selectModelName,
	} = useFitJobDetail();

	const recipe = useSlotRecipe({ recipe: fitJobDrawerRecipe });
	const styles = recipe();

	if (!selectedJob || !status) {
		return (
			<Drawer.Body pt={0} px={0} className="custom-scrollbar" css={styles.body}>
				<Flex css={styles.emptyState}>
					<Info size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
					<Text>Select a job to view results.</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	if (status === "pending" || status === "processing") {
		return (
			<Drawer.Body pt={0} px={0} className="custom-scrollbar" css={styles.body}>
				<Flex css={styles.emptyState}>
					<Spinner size="lg" color="cyan.300" />
					<Text>Job is {status}...</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	if (status === "failed") {
		return (
			<Drawer.Body pt={0} px={0} className="custom-scrollbar" css={styles.body}>
				<Flex
					direction="column"
					align="center"
					justify="center"
					h="full"
					textAlign="center"
					px={6}
					gap={2}
				>
					<Text css={styles.errorText} fontWeight="semibold">
						Job failed
					</Text>
					<Text fontSize="sm" color="fg.muted">
						{selectedJob.error || "An unknown error occurred."}
					</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	return (
		<Drawer.Body pt={0} px={0} className="custom-scrollbar" css={styles.body}>
			<VStack align="stretch" gap={6} p={4}>
				{summaryLoading && (
					<Flex align="center" gap={3} color="fg.muted">
						<Spinner size="sm" color="cyan.300" />
						<Text>Loading summary...</Text>
					</Flex>
				)}
				{summaryError && <Text css={styles.errorText}>{summaryError}</Text>}
				{summary && (
					<>
						<SourceInfo source={summary.source} />
						<SummaryPanel
							summary={summary}
							selectedModelName={selectedModelName}
							onSelectModelName={selectModelName}
						/>
					</>
				)}

				{/* Pass necessary props to Visuals component */}
				<FitJobVisuals
					jobId={selectedJob.job_id}
					selectedModelName={selectedModelName}
					isCompleted={status === "completed" || status === "saved"}
					bestModelName={summary?.best_model_name}
				/>
			</VStack>
		</Drawer.Body>
	);
}
