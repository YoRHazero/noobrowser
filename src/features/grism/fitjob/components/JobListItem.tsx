import { Badge, Flex, HStack, Text, useSlotRecipe } from "@chakra-ui/react";
import { Ban, CheckCircle, Clock, Info } from "lucide-react";
import type { FitJobStatusResponse } from "@/hooks/query/fit";
import { jobListItemRecipe } from "../recipes/job-list-item.recipe";

interface JobListItemProps {
	job: FitJobStatusResponse;
	isSelected: boolean;
	onSelect: (id: string) => void;
}

export function JobListItem({ job, isSelected, onSelect }: JobListItemProps) {
	const recipe = useSlotRecipe({ recipe: jobListItemRecipe });
	const styles = recipe();

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
			case "saved":
				return <CheckCircle size={12} />;
			case "processing":
				return <Clock size={12} className="animate-pulse" />;
			case "pending":
				return <Clock size={12} />;
			case "failed":
				return <Ban size={12} />;
			default:
				return <Info size={12} />;
		}
	};

	const getStatusPalette = (status: string) => {
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
	};

	return (
		<Flex
			css={styles.root}
			onClick={() => onSelect(job.job_id)}
			data-selected={isSelected || undefined}
		>
			<HStack gap={3}>
				<Badge
					variant={job.status === "processing" ? "subtle" : "solid"}
					colorPalette={getStatusPalette(job.status)}
					size="sm"
				>
					<HStack gap={1}>
						{getStatusIcon(job.status)}
						<Text>{job.status.toUpperCase()}</Text>
					</HStack>
				</Badge>
				<Text css={styles.jobId}>
					ID: {job.job_id.slice(0, 8)}
				</Text>
			</HStack>
		</Flex>
	);
}
