import { Box, Tabs } from "@chakra-ui/react";
import FootprintList from "./FootprintList";
import UserPointsPanel from "./UserPointsPanel";

export default function FootprintPanel() {
	return (
		<Box width="100%" height="100%">
			<Tabs.Root defaultValue="footprints" variant="line" fitted>
				<Tabs.List bg="bg.muted">
					<Tabs.Trigger value="footprints">Footprints</Tabs.Trigger>
					<Tabs.Trigger value="userPoints">User Points</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="footprints" p={0}>
					<FootprintList />
				</Tabs.Content>
				<Tabs.Content value="userPoints" p={0}>
					<UserPointsPanel />
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
}
