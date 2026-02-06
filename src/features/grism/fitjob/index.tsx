import { Drawer } from "@chakra-ui/react";
import JobActionFooter from "./components/JobActionFooter";
import JobDetailView from "./components/JobDetailView";
import JobListView from "./components/JobListView";
import { FitJobSelectionProvider } from "./hooks/useFitJobSelection";
import FitJobPoller from "./FitJobPoller";

export default function GrismFitJobDrawer({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Drawer.Root placement="end" size="xl">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>{children}</Drawer.Trigger>
			<Drawer.Positioner>
				<Drawer.Content bg="#09090b" borderLeft="1px solid #333">
					<FitJobSelectionProvider>
						<FitJobPoller />
						<JobListView />
						<JobDetailView />
						<JobActionFooter />
					</FitJobSelectionProvider>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
