"use client";

import { HStack, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { FitJobRecord } from "../../shared/types";
import JobListItem from "../JobListItem";
import { jobListRecipe } from "./JobList.recipe";

type JobListProps = {
	jobs: FitJobRecord[];
	selectedJobId: string | null;
	isLoading: boolean;
	error: string | null;
	onSelectJob: (jobId: string) => void;
};

export default function JobList({
	jobs,
	selectedJobId,
	isLoading,
	error,
	onSelectJob,
}: JobListProps) {
	const recipe = useSlotRecipe({ recipe: jobListRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<Stack css={styles.header}>
				<Text css={styles.title}>Jobs</Text>
				<HStack css={styles.subtitleRow}>
					<Text css={styles.subtitle}>
						{jobs.length} job{jobs.length === 1 ? "" : "s"} available
					</Text>
					{isLoading ? <Text css={styles.subtitle}>Loading...</Text> : null}
				</HStack>
			</Stack>

			<Stack css={styles.list}>
				{error ? <Text css={styles.errorText}>{error}</Text> : null}
				{!error && jobs.length === 0 && !isLoading ? (
					<Text css={styles.emptyState}>No fit jobs found.</Text>
				) : null}
				{jobs.map((job) => (
					<JobListItem
						key={job.job_id}
						job={job}
						selected={selectedJobId === job.job_id}
						onSelectJob={onSelectJob}
					/>
				))}
			</Stack>
		</Stack>
	);
}
