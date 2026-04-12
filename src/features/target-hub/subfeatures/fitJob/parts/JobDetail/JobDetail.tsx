"use client";

import {
	Badge,
	Box,
	HStack,
	Spinner,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { CircleAlert, Info } from "lucide-react";
import type {
	FitJobPlotState,
	FitJobRecord,
	FitJobSummary,
} from "../../shared/types";
import JobVisualTabs from "../JobVisualTabs";
import SourceInfo from "../SourceInfo";
import SummaryPanel from "../SummaryPanel";
import { jobDetailRecipe } from "./JobDetail.recipe";

type JobDetailProps = {
	selectedJob: FitJobRecord | null;
	status: FitJobRecord["status"] | null;
	summary: FitJobSummary | null;
	summaryLoading: boolean;
	summaryError: string | null;
	selectedModelName: string | null;
	onSelectModelName: (modelName: string) => void;
	plots: FitJobPlotState[];
};

function getStatusPalette(status: FitJobRecord["status"] | null) {
	switch (status) {
		case "completed":
		case "saved":
			return "green";
		case "processing":
			return "blue";
		case "pending":
			return "gray";
		case "failed":
			return "red";
		default:
			return "gray";
	}
}

export default function JobDetail({
	selectedJob,
	status,
	summary,
	summaryLoading,
	summaryError,
	selectedModelName,
	onSelectModelName,
	plots,
}: JobDetailProps) {
	const recipe = useSlotRecipe({ recipe: jobDetailRecipe });
	const styles = recipe();

	if (!selectedJob) {
		return (
			<Stack css={styles.root}>
				<Stack css={styles.emptyState}>
					<Info size={30} />
					<Text>Select a job to inspect its result summary.</Text>
				</Stack>
			</Stack>
		);
	}

	if (status === "pending" || status === "processing") {
		return (
			<Stack css={styles.root}>
				<HStack css={styles.statusLine}>
					<Text css={styles.jobTitle}>
						Job {selectedJob.job_id.slice(0, 8)}
					</Text>
					<Badge colorPalette={getStatusPalette(status)} variant="solid">
						{status}
					</Badge>
				</HStack>
				<Stack css={styles.emptyState}>
					<Spinner size="lg" css={styles.spinner} />
					<Text>Job is currently {status}.</Text>
				</Stack>
			</Stack>
		);
	}

	if (status === "failed") {
		return (
			<Stack css={styles.root}>
				<HStack css={styles.statusLine}>
					<Text css={styles.jobTitle}>
						Job {selectedJob.job_id.slice(0, 8)}
					</Text>
					<Badge colorPalette="red" variant="solid" css={styles.statusBadge}>
						failed
					</Badge>
				</HStack>
				<Box>
					<HStack css={styles.failedMessageLine}>
						<Box css={styles.failedIcon}>
							<CircleAlert size={16} />
						</Box>
						<Text css={styles.errorText}>
							{selectedJob.error || "The job failed without a backend message."}
						</Text>
					</HStack>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack css={styles.root}>
			<HStack css={styles.statusLine}>
				<Stack css={styles.jobMetaStack}>
					<Text css={styles.jobTitle}>
						Job {selectedJob.job_id.slice(0, 8)}
					</Text>
					<Text css={styles.jobStatusText}>{selectedJob.status}</Text>
				</Stack>
				<Badge
					colorPalette={getStatusPalette(status)}
					variant="solid"
					css={styles.statusBadge}
				>
					{status}
				</Badge>
			</HStack>

			{summaryLoading ? (
				<HStack css={styles.summaryLoadingLine}>
					<Spinner size="sm" css={styles.spinner} />
					<Text>Loading summary...</Text>
				</HStack>
			) : null}
			{summaryError ? <Text css={styles.errorText}>{summaryError}</Text> : null}

			<Stack css={styles.content}>
				{summaryLoading && !summary ? (
					<Stack css={styles.emptyState}>
						<Spinner size="lg" css={styles.spinner} />
						<Text>Loading summary...</Text>
					</Stack>
				) : summary ? (
					<>
						<SourceInfo summary={summary} />
						<SummaryPanel
							summary={summary}
							selectedModelName={selectedModelName}
							onSelectModelName={onSelectModelName}
						/>
						<JobVisualTabs plots={plots} />
					</>
				) : (
					<Stack css={styles.emptyState}>
						<Info size={28} />
						<Text>Summary data is not available yet.</Text>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
}
