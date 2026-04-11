import type { SystemStyleObject } from "@chakra-ui/react";
import {
	Button,
	HStack,
	IconButton,
	Popover,
	Portal,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { ChartSpline, Plus, Settings2 } from "lucide-react";
import { DarkMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { ProjectionControls } from "../../components/ProjectionControls";
import Ned from "../../ned";
import { sheetRecipe } from "../../recipes/sheet.recipe";
import type { EditorHeaderModel } from "../hooks/useEditorHeaderModel";
import type {
	EditorActionsModel,
	EditorExtractionModel,
	EditorSpectrumModel,
} from "../hooks/useEditorSpectrumModel";
import { ExtractionDraftField } from "./ExtractionDraftField";

const SOURCE_ACTION_ICON_SIZE = 14;

interface SpectrumSectionProps {
	header: EditorHeaderModel;
	extraction: EditorExtractionModel;
	spectrum: EditorSpectrumModel;
	actions: EditorActionsModel;
}

export function SpectrumSection({
	header,
	extraction,
	spectrum,
	actions,
}: SpectrumSectionProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();
	const actionsJustify = header.isDetail ? "space-between" : "flex-end";

	return (
		<HStack
			css={{
				...styles.editorActions,
				justifyContent: actionsJustify,
			}}
		>
			{header.isDetail ? (
				<>
					<ProjectionControls
						isOverviewVisible={actions.overviewVisible}
						isInspectorVisible={actions.inspectorVisible}
						onToggleOverview={actions.onToggleOverview}
						onToggleInspector={actions.onToggleInspector}
					/>

					<HStack css={styles.chipGroup}>
						<Ned />

						<Popover.Root
							open={extraction.isSettingsOpen}
							onOpenChange={(details) => extraction.onOpenChange(details.open)}
							positioning={{
								placement: "top-end",
								offset: { mainAxis: 10, crossAxis: 0 },
							}}
						>
							<Popover.Trigger asChild>
								<Tooltip content="Extraction settings" showArrow>
									<IconButton
										type="button"
										aria-label="Spectrum Extraction Settings"
										size="sm"
										variant="ghost"
										css={styles.chip}
									>
										<Settings2 size={SOURCE_ACTION_ICON_SIZE} />
									</IconButton>
								</Tooltip>
							</Popover.Trigger>
							<Portal>
								<DarkMode>
									<Popover.Positioner>
										<Popover.Content
											w="240px"
											borderColor="whiteAlpha.180"
											bg="rgba(9, 15, 28, 0.98)"
											boxShadow="0 18px 42px rgba(2, 8, 23, 0.48)"
										>
											<Popover.Arrow bg="rgba(9, 15, 28, 0.98)" />
											<Popover.Body p={3}>
												<Stack gap={3}>
													<Text
														fontSize="xs"
														fontWeight="semibold"
														letterSpacing="normal"
														textTransform="none"
														color="white"
													>
														Extraction settings
													</Text>

													<ExtractionDraftField
														label="Aperture (px)"
														value={extraction.apertureSize}
														step={1}
														min={0}
														onChange={extraction.onApertureSizeChange}
													/>
													<ExtractionDraftField
														label="Wave min (um)"
														value={extraction.waveMinUm}
														step={0.1}
														min={0}
														onChange={extraction.onWaveMinUmChange}
													/>
													<ExtractionDraftField
														label="Wave max (um)"
														value={extraction.waveMaxUm}
														step={0.1}
														min={0}
														onChange={extraction.onWaveMaxUmChange}
													/>

													<Text
														fontSize="xs"
														color={
															extraction.canSave
																? "whiteAlpha.660"
																: "orange.200"
														}
														lineHeight={1.5}
														minH="18px"
													>
														{extraction.saveDisabledReason ??
															"Changes apply after you save."}
													</Text>

													<HStack justify="flex-end" gap={2}>
														<Button
															type="button"
															size="sm"
															variant="ghost"
															color="whiteAlpha.860"
															textTransform="none"
															onClick={extraction.onReset}
														>
															Reset
														</Button>
														<Button
															type="button"
															size="sm"
															variant="outline"
															borderColor="whiteAlpha.220"
															color="white"
															textTransform="none"
															disabled={!extraction.canSave}
															onClick={extraction.onSave}
														>
															Save
														</Button>
													</HStack>
												</Stack>
											</Popover.Body>
										</Popover.Content>
									</Popover.Positioner>
								</DarkMode>
							</Portal>
						</Popover.Root>

						<Tooltip
							content={spectrum.fetchDisabledReason ?? "Fetch spectrum"}
							showArrow
						>
							<IconButton
								type="button"
								aria-label="Fetch Spectrum"
								size="sm"
								variant="ghost"
								css={createChipStyles(styles.chip, spectrum.canFetch)}
								disabled={!spectrum.canFetch}
								onClick={spectrum.onFetch}
							>
								<ChartSpline size={SOURCE_ACTION_ICON_SIZE} />
							</IconButton>
						</Tooltip>
					</HStack>
				</>
			) : (
				<Tooltip content="Create source" showArrow>
					<IconButton
						type="button"
						aria-label="Create Source"
						size="sm"
						variant="ghost"
						css={createChipStyles(styles.chip, header.canSubmit)}
						disabled={!header.canSubmit}
						onClick={header.onCreateSource}
					>
						<Plus size={SOURCE_ACTION_ICON_SIZE} />
					</IconButton>
				</Tooltip>
			)}
		</HStack>
	);
}

function createChipStyles(baseCss: SystemStyleObject, enabled: boolean) {
	return {
		...baseCss,
		borderColor: enabled ? "cyan.300" : baseCss.borderColor,
		bg: enabled ? "rgba(34, 211, 238, 0.16)" : baseCss.bg,
		color: enabled ? "white" : baseCss.color,
		boxShadow: enabled ? "0 0 0 1px rgba(34, 211, 238, 0.22)" : undefined,
	};
}
