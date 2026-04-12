"use client";

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
import { nedRecipe } from "./Ned.recipe";
import { NedResultsContent } from "./parts/NedResultsContent";
import { NedSettingsContent } from "./parts/NedSettingsContent";
import { useNed } from "./useNed";

const SOURCE_ACTION_ICON_SIZE = 14;

export default function Ned() {
	const model = useNed();
	const recipe = useSlotRecipe({ recipe: nedRecipe });
	const triggerTone = model.trigger.isErrorHighlighted
		? "error"
		: model.trigger.isHighlighted
			? "active"
			: "default";
	const styles = recipe({ triggerTone });
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
				<Box as="span" css={styles.triggerFrame}>
					<Tooltip content={model.trigger.tooltip} showArrow>
						<Box as="span" css={styles.triggerFrame}>
							<IconButton
								type="button"
								aria-label="NED Search"
								size="sm"
								variant="ghost"
								css={styles.chip}
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
						<Popover.Content css={styles.content}>
							<Popover.Arrow css={styles.arrow} />
							<Popover.Body css={styles.body}>{content}</Popover.Body>
						</Popover.Content>
					</Popover.Positioner>
				</DarkMode>
			</Portal>
		</Popover.Root>
	);
}
