import { Badge, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { Ban, CheckCircle, Clock, Info, Trash2 } from "lucide-react";
import type { FitJobResponse } from "@/hooks/query/fit/schemas";

interface JobListItemProps {
	job: FitJobResponse;
	isSelected: boolean;
	onSelect: (id: string, status: string) => void;
	onRemove: (id: string) => void;
}

export function JobListItem({
	job,
	isSelected,
	onSelect,
	onRemove,
}: JobListItemProps) {
	const isCompleted = job.status === "completed";

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
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
			justify="space-between"
			align="center"
			bg={isSelected ? "cyan.900/30" : "whiteAlpha.50"}
			borderColor={isSelected ? "cyan.500" : "whiteAlpha.100"}
			borderWidth="1px"
			borderRadius="md"
			p={2}
			cursor="pointer"
			_hover={{
				borderColor: isCompleted ? "cyan.400" : undefined,
				bg: isSelected ? "cyan.900/40" : "whiteAlpha.100",
			}}
			onClick={() => onSelect(job.job_id, job.status)}
			transition="all 0.2s"
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
				<Text fontSize="xs" fontFamily="mono" color="gray.400">
					ID: {job.job_id.slice(0, 8)}
				</Text>
			</HStack>

			{(job.status === "completed" || job.status === "failed") && (
				<IconButton
					size="xs"
					variant="ghost"
					colorPalette="red"
					aria-label="Delete job"
					onClick={(e) => {
						e.stopPropagation();
						onRemove(job.job_id);
					}}
				>
					<Trash2 size={14} />
				</IconButton>
			)}
		</Flex>
	);
}
