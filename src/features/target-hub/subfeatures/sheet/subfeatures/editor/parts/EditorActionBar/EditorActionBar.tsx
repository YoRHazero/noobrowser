import {
	HStack,
	IconButton,
	Popover,
	Portal,
	useSlotRecipe,
} from "@chakra-ui/react";
import { ChartSpline, Plus, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { DarkMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { ProjectionControls } from "../../../../parts/ProjectionControls";
import type {
	EditorActionsModel,
	EditorExtractionModel,
	EditorHeaderModel,
	EditorSpectrumModel,
} from "../../shared/types";
import { ExtractionSettingsContent } from "../ExtractionSettingsContent";
import { editorActionBarRecipe } from "./EditorActionBar.recipe";

const ACTION_BAR_ICON_SIZE = 14;

interface EditorActionBarProps {
	header: EditorHeaderModel;
	extraction: EditorExtractionModel;
	spectrum: EditorSpectrumModel;
	actions: EditorActionsModel;
	detailActionAddon?: ReactNode;
}

export function EditorActionBar({
	header,
	extraction,
	spectrum,
	actions,
	detailActionAddon,
}: EditorActionBarProps) {
	const recipe = useSlotRecipe({ recipe: editorActionBarRecipe });
	const styles = recipe({ isDetail: header.isDetail });
	const activeChipStyles = recipe({ chipTone: "active" }).chip;

	return (
		<HStack css={styles.editorActions}>
			{header.isDetail ? (
				<>
					<ProjectionControls
						isOverviewVisible={actions.overviewVisible}
						isInspectorVisible={actions.inspectorVisible}
						onToggleOverview={actions.onToggleOverview}
						onToggleInspector={actions.onToggleInspector}
					/>

					<HStack css={styles.chipGroup}>
						{detailActionAddon}

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
										<Settings2 size={ACTION_BAR_ICON_SIZE} />
									</IconButton>
								</Tooltip>
							</Popover.Trigger>
							<Portal>
								<DarkMode>
									<Popover.Positioner>
										<Popover.Content css={styles.popoverContent}>
											<Popover.Arrow css={styles.popoverArrow} />
											<Popover.Body css={styles.popoverBody}>
												<ExtractionSettingsContent extraction={extraction} />
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
								css={spectrum.canFetch ? activeChipStyles : styles.chip}
								disabled={!spectrum.canFetch}
								onClick={spectrum.onFetch}
							>
								<ChartSpline size={ACTION_BAR_ICON_SIZE} />
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
						css={header.canSubmit ? activeChipStyles : styles.chip}
						disabled={!header.canSubmit}
						onClick={header.onCreateSource}
					>
						<Plus size={ACTION_BAR_ICON_SIZE} />
					</IconButton>
				</Tooltip>
			)}
		</HStack>
	);
}
