"use client";

import { Badge, Box, HStack, Text, useSlotRecipe } from "@chakra-ui/react";
import { Ban, CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import type { FitJobRecord } from "../../shared/types";
import { jobListItemRecipe } from "./JobListItem.recipe";

type JobListItemProps = {
	job: FitJobRecord;
	selected: boolean;
	onSelectJob: (jobId: string) => void;
};

function getStatusMeta(status: FitJobRecord["status"]) {
	switch (status) {
		case "completed":
		case "saved":
			return {
				icon: CheckCircle2,
				palette: "green",
			};
		case "processing":
			return {
				icon: Clock3,
				palette: "blue",
			};
		case "pending":
			return {
				icon: Clock3,
				palette: "gray",
			};
		case "failed":
			return {
				icon: Ban,
				palette: "red",
			};
		default:
			return {
				icon: CircleAlert,
				palette: "gray",
			};
	}
}

export default function JobListItem({
	job,
	selected,
	onSelectJob,
}: JobListItemProps) {
	const recipe = useSlotRecipe({ recipe: jobListItemRecipe });
	const styles = recipe({ selected });
	const statusMeta = getStatusMeta(job.status);
	const StatusIcon = statusMeta.icon;

	return (
		<Box
			as="button"
			css={styles.root}
			onClick={() => onSelectJob(job.job_id)}
			aria-pressed={selected}
		>
			<HStack css={styles.main}>
				<HStack css={styles.metaRow}>
					<Badge colorPalette={statusMeta.palette} variant="solid" size="sm">
						<HStack css={styles.badgeContent}>
							<StatusIcon size={11} />
							<Text css={styles.status}>{job.status}</Text>
						</HStack>
					</Badge>
					<Text css={styles.jobId}>Job {job.job_id.slice(0, 8)}</Text>
				</HStack>
			</HStack>
			{job.error ? <Text css={styles.error}>{job.error}</Text> : null}
		</Box>
	);
}
