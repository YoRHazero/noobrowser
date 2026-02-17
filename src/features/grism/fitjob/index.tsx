import { Drawer, useSlotRecipe } from "@chakra-ui/react";
import FitJobActions from "./FitJobActions";
import FitJobDetail from "./FitJobDetail";
import FitJobList from "./FitJobList";
import { FitJobSelectionProvider } from "./hooks/useFitJobSelection";
import { fitJobDrawerRecipe } from "./recipes/fit-job-drawer.recipe";
import { useFitJobs } from "@/hooks/query/fit";

export default function GrismFitJobDrawer({
	children,
}: {
	children: React.ReactNode;
}) {
	const recipe = useSlotRecipe({ recipe: fitJobDrawerRecipe });
	const styles = recipe();

	// Global poller for the feature
	// Polls every 2s only if there are active jobs
	// If drawer is open, FitJobList mounts and triggers an immediate fetch
	useFitJobs({
		limit: 50,
		options: {
			refetchInterval: (query) => {
				const data = query.state.data;
				const hasActiveJobs = data?.some(
					(job) => job.status === "pending" || job.status === "processing",
				);
				return hasActiveJobs ? 2000 : false;
			},
		},
	});

	return (
		<Drawer.Root placement="end" size="xl">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>{children}</Drawer.Trigger>
			<Drawer.Positioner>
				<Drawer.Content css={styles.content}>
					<FitJobSelectionProvider>
						<FitJobList />
						<FitJobDetail />
						<FitJobActions />
					</FitJobSelectionProvider>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
