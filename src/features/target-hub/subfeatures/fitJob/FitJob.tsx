"use client";

import {
	Box,
	CloseButton,
	Drawer,
	HStack,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { fitJobRecipe } from "./FitJob.recipe";
import JobDetail from "./parts/JobDetail";
import JobFooterActions from "./parts/JobFooterActions";
import JobList from "./parts/JobList";
import { useFitJob } from "./useFitJob";

export default function FitJob() {
	const model = useFitJob();
	const recipe = useSlotRecipe({ recipe: fitJobRecipe });
	const styles = recipe();

	return (
		<Drawer.Root
			open={model.isOpen}
			placement="end"
			onOpenChange={(details) => {
				if (details.open) {
					model.openJobsDrawer();
				} else {
					model.closeJobsDrawer();
				}
			}}
		>
			<Drawer.Backdrop css={styles.backdrop} />
			<Drawer.Positioner>
				<Drawer.Content css={styles.content}>
					<Drawer.Header css={styles.header}>
						<HStack css={styles.titleRow}>
							<Stack css={styles.titleStack}>
								<Text css={styles.title}>Fit Jobs</Text>
								<Text css={styles.subtitle}>
									{model.list.jobs.length} job
									{model.list.jobs.length === 1 ? "" : "s"} tracked
								</Text>
							</Stack>
							<Drawer.CloseTrigger asChild>
								<CloseButton css={styles.closeButton} />
							</Drawer.CloseTrigger>
						</HStack>
					</Drawer.Header>

					<Drawer.Body css={styles.body}>
						<Box css={styles.grid}>
							<JobList
								jobs={model.list.jobs}
								selectedJobId={model.list.selectedJobId}
								isLoading={model.list.isLoading}
								error={model.list.error}
								onSelectJob={model.list.onSelectJob}
							/>
							<JobDetail
								selectedJob={model.detail.selectedJob}
								status={model.detail.status}
								summary={model.detail.summary}
								summaryLoading={model.detail.summaryLoading}
								summaryError={model.detail.summaryError}
								selectedModelName={model.detail.selectedModelName}
								onSelectModelName={model.detail.onSelectModelName}
								plots={model.plots}
							/>
						</Box>
					</Drawer.Body>

					<JobFooterActions
						selectedJobId={model.list.selectedJobId}
						status={model.detail.status}
						selectedTags={model.actions.selectedTags}
						canSave={model.actions.canSave}
						canDelete={model.actions.canDelete}
						isSaving={model.actions.isSaving}
						isDeleting={model.actions.isDeleting}
						onTagsChange={model.actions.onTagsChange}
						onSave={model.actions.onSave}
						onDelete={model.actions.onDelete}
					/>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
