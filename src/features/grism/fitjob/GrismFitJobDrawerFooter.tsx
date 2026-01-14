import { Button, Drawer, Flex } from "@chakra-ui/react";
import {
	type FitJobResponse,
	useSaveFitResultMutation,
} from "@/hook/connection-hook";

interface GrismFitJobDrawerFooterProps {
	selectedJob?: FitJobResponse;
}

export default function GrismFitJobDrawerFooter({
	selectedJob,
}: GrismFitJobDrawerFooterProps) {
	const { mutate: saveFitResult, isPending } = useSaveFitResultMutation();

	const handleSave = () => {
		if (!selectedJob) return;

		saveFitResult({
			sourceId: selectedJob.job_id,
			tags: [],
		});
	};

	return (
		<Drawer.Footer borderTop="1px solid #333">
			<Flex w="full" gap={2}>
				{/* Placeholder for TagsInput */}
				<Button variant="surface" flex={1} disabled>
					Tags (Coming Soon)
				</Button>
				<Button
					colorPalette="blue"
					onClick={handleSave}
					loading={isPending}
					disabled={!selectedJob || selectedJob.status !== "completed"}
				>
					Save
				</Button>
			</Flex>
		</Drawer.Footer>
	);
}
