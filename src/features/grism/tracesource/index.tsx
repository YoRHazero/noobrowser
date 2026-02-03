// @/features/grism/tracesource/TraceSourceDrawer.tsx
import {
	Badge,
	Box,
	Button,
	CloseButton,
	Drawer,
	Flex,
	Heading,
	HStack,
	Portal,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Crosshair, ListFilter, Target } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import GlobalControls from "./GlobalControls";
import SourceCard from "./SourceCard";
import SpectrumPoller from "./SpectrumPoller";
import LinkSearchPanel from "./NedSearchPanel";
import { useSourcesStore } from "@/stores/sources";

export default function TraceSourceDrawer() {
	const { traceMode, traceSources, mainTraceSourceId } = useSourcesStore(
		useShallow((state) => ({
			traceMode: state.traceMode,
			traceSources: state.traceSources,
			mainTraceSourceId: state.mainTraceSourceId,
		})),
	);

	const mainSource = traceSources.find((s) => s.id === mainTraceSourceId);


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
					variant={traceMode ? "solid" : "ghost"}
					colorPalette={traceMode ? "cyan" : "gray"}
					animation={traceMode ? "selected" : undefined}
					boxShadow={traceMode ? "0 0 15px {colors.cyan.500/30}" : undefined}
				>
					<HStack gap={2}>
						{traceMode ? <Target size={16} /> : <ListFilter size={16} />}
						<Text>{traceMode ? "Trace Mode" : "Source List"}</Text>
						{traceSources.length > 0 && (
							<Badge
								variant="solid"
								colorPalette={traceMode ? "cyan" : "gray"}
								size="xs"
							>
								{traceSources.length}
							</Badge>
						)}
						<SpectrumPoller />
					</HStack>
				</Button>
			</Drawer.Trigger>
			<Portal>
				<Drawer.Positioner>
					<Drawer.Content display="flex" flexDirection="column" h="100%">
						{/* Header */}
						<Drawer.Header flexShrink={0}>
							<HStack justify="space-between">
								<HStack>
									<Crosshair
										size={18}
										color={
											traceMode
												? "var(--chakra-colors-cyan-400)"
												: "var(--chakra-colors-gray-400)"
										}
									/>
									<Heading size="sm" color="fg">
										Trace Sources
									</Heading>
								</HStack>
								<Drawer.CloseTrigger asChild>
									<CloseButton />
								</Drawer.CloseTrigger>
							</HStack>
						</Drawer.Header>

						{/* Body - Scrollable Area */}
						<Drawer.Body
							className="custom-scrollbar"
							flex="1"
							overflowY="auto"
							px={4}
							pb={4}
						>
							{traceSources.length === 0 ? (
								<Flex
									direction="column"
									align="center"
									justify="center"
									h="100%" // 充满可用高度
									color="fg.muted"
								>
									<Target
										size={40}
										style={{ opacity: 0.5, marginBottom: 10 }}
									/>
									<Text fontSize="sm">No trace sources initialized.</Text>
								</Flex>
							) : (
								<Stack gap={3}>
									{traceSources.map((source) => (
										<SourceCard key={source.id} source={source} />
									))}
									{/* Add padding at bottom so last card isn't flush against controls */}
									<Box h="4" />
								</Stack>
							)}
						</Drawer.Body>

						{/* Footer / Global Controls - Fixed at bottom */}
						<Box flexShrink={0}>
							{mainSource?.ra !== undefined && mainSource?.dec !== undefined && (
								<LinkSearchPanel ra={mainSource.ra} dec={mainSource.dec} />
							)}
							<GlobalControls />
						</Box>
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
}
