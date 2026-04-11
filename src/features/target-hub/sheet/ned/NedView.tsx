"use client";

import type { SystemStyleObject } from "@chakra-ui/react";
import {
	Box,
	IconButton,
	Popover,
	Portal,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { DarkMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { sheetRecipe } from "../recipes/sheet.recipe";
import { NedResultsContent } from "./components/NedResultsContent";
import { NedSettingsContent } from "./components/NedSettingsContent";
import type { NedViewModel } from "./useNed";

const SOURCE_ACTION_ICON_SIZE = 14;

interface NedViewProps {
	model: NedViewModel;
}

export function NedView({ model }: NedViewProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();
	const content =
		model.mode === "settings" ? (
			<NedSettingsContent
				draftValue={model.settings.draftValue}
				draftUnit={model.settings.draftUnit}
				canSave={model.settings.canSave}
				saveDisabledReason={model.settings.saveDisabledReason}
				canRefetch={model.settings.canRefetch}
				refetchDisabledReason={model.settings.refetchDisabledReason}
				onDraftValueChange={model.settings.onDraftValueChange}
				onDraftUnitChange={model.settings.onDraftUnitChange}
				onSave={model.settings.onSave}
				onRefetch={model.settings.onRefetch}
			/>
		) : (
			<NedResultsContent
				isFetching={model.results.isFetching}
				isSuccess={model.results.isSuccess}
				isError={model.results.isError}
				errorMessage={model.results.errorMessage}
				results={model.results.results}
			/>
		);

	return (
		<Popover.Root
			open={model.isOpen}
			onOpenChange={(details) => model.onOpenChange(details.open)}
			positioning={{
				placement: "top-end",
				offset: { mainAxis: 10, crossAxis: 0 },
			}}
			lazyMount
			unmountOnExit
		>
			<Popover.Anchor asChild>
				<Box as="span" display="inline-flex">
					<Tooltip content={model.trigger.tooltip} showArrow>
						<Box as="span" display="inline-flex">
							<IconButton
								type="button"
								aria-label="NED Search"
								size="sm"
								variant="ghost"
								css={createChipStyles(
									styles.chip,
									model.trigger.isHighlighted,
									model.trigger.isErrorHighlighted,
								)}
								disabled={model.trigger.disabled}
								loading={model.trigger.loading}
								onClick={model.trigger.onClick}
								onContextMenu={model.trigger.onContextMenu}
							>
								<Search size={SOURCE_ACTION_ICON_SIZE} />
							</IconButton>
						</Box>
					</Tooltip>
				</Box>
			</Popover.Anchor>

			<Portal>
				<DarkMode>
					<Popover.Positioner>
						<Popover.Content
							w="320px"
							borderColor="whiteAlpha.180"
							bg="rgba(9, 15, 28, 0.98)"
							boxShadow="0 18px 42px rgba(2, 8, 23, 0.48)"
						>
							<Popover.Arrow bg="rgba(9, 15, 28, 0.98)" />
							<Popover.Body p={3}>{content}</Popover.Body>
						</Popover.Content>
					</Popover.Positioner>
				</DarkMode>
			</Portal>
		</Popover.Root>
	);
}

function createChipStyles(
	baseCss: SystemStyleObject,
	isHighlighted: boolean,
	isErrorHighlighted: boolean,
) {
	if (isErrorHighlighted) {
		return {
			...baseCss,
			borderColor: "red.300",
			bg: "rgba(239, 68, 68, 0.16)",
			color: "white",
			boxShadow: "0 0 0 1px rgba(248, 113, 113, 0.22)",
		};
	}

	if (isHighlighted) {
		return {
			...baseCss,
			borderColor: "cyan.300",
			bg: "rgba(34, 211, 238, 0.16)",
			color: "white",
			boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.22)",
		};
	}

	return baseCss;
}
