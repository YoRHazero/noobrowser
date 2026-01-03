import { Badge, Button, Drawer, HStack, Stack, Text } from "@chakra-ui/react";
import { ListFilter, Target } from "lucide-react";
import type { TraceSource } from "@/stores/stores-types";
import DrawerHeaderView from "./components/DrawerHeader.view";
import EmptyStateView from "./components/EmptyState.view";
import GlobalControlsContainer from "./components/GlobalControls/GlobalControls.container";
import SourceCardContainer from "./components/SourceCard/SourceCard.container";
import { drawerStyle, pulseKeyframe } from "./styles";
import type { GlobalSettings, SetSettings, UpdateSource } from "./types";

export default function GrismTraceSourceDrawerView(props: {
	traceMode: boolean;
	traceSources: TraceSource[];
	mainTraceSourceId: string | null;

	settings: GlobalSettings;
	setSettings: SetSettings;
	isValidSettings: boolean;

	onSetMain: (id: string) => void;
	onRemove: (id: string) => void;
	onClearAll: () => void;
	onApplyRoi: () => void;
	onUpdateSource: UpdateSource;
}) {
	const {
		traceMode,
		traceSources,
		mainTraceSourceId,
		settings,
		setSettings,
		isValidSettings,
		onSetMain,
		onRemove,
		onClearAll,
		onApplyRoi,
		onUpdateSource,
	} = props;

	return (
		<Drawer.Root placement="end" size="md">
			<Drawer.Backdrop />

			<Drawer.Trigger asChild>
				<Button
					position="absolute"
					bottom="12px"
					right="12px"
					zIndex={10}
					size="sm"
					fontSize="xs"
					{...(traceMode
						? {
								colorPalette: "cyan",
								variant: "solid",
								animation: `${pulseKeyframe} 2s infinite`,
								boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
							}
						: { variant: "ghost", color: "gray.500" })}
				>
					<HStack gap={2}>
						{traceMode ? <Target size={16} /> : <ListFilter size={16} />}
						<Text>{traceMode ? "TRACE ACTIVE" : "Sources"}</Text>
						{traceSources.length > 0 && (
							<Badge
								variant="solid"
								colorPalette={traceMode ? "cyan" : "gray"}
								size="xs"
							>
								{traceSources.length}
							</Badge>
						)}
					</HStack>
				</Button>
			</Drawer.Trigger>

			<Drawer.Positioner>
				<Drawer.Content
					bg={drawerStyle.contentBg}
					borderLeft={drawerStyle.contentBorderLeft}
				>
					<Drawer.Header borderBottom={drawerStyle.headerBorderBottom} pb={4}>
						<DrawerHeaderView traceMode={traceMode} />
					</Drawer.Header>

					<Drawer.Body pt={4} px={4} className="custom-scrollbar">
						{traceSources.length === 0 ? (
							<EmptyStateView />
						) : (
							<Stack gap={3}>
								{traceSources.map((source) => (
									<SourceCardContainer
										key={source.id}
										source={source}
										isMain={source.id === mainTraceSourceId}
										settings={settings}
										isValidSettings={isValidSettings}
										onSetMain={onSetMain}
										onRemove={onRemove}
										onUpdateSource={onUpdateSource}
									/>
								))}
							</Stack>
						)}
					</Drawer.Body>

					<GlobalControlsContainer
						settings={settings}
						setSettings={setSettings}
						totalSources={traceSources.length}
						mainTraceSourceId={mainTraceSourceId}
						onApplyRoi={onApplyRoi}
						onClearAll={onClearAll}
					/>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
