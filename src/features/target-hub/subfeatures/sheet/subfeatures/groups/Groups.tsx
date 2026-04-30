"use client";

import {
	Box,
	Button,
	createListCollection,
	HStack,
	IconButton,
	Input,
	Popover,
	Portal,
	Select,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { DarkMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { ProjectionControls } from "../../parts/ProjectionControls";
import { groupsRecipe } from "./Groups.recipe";
import { ALL_GROUPS_VALUE, useGroups } from "./useGroups";

const GROUP_ACTION_ICON_SIZE = 14;

interface GroupTagPopoverProps {
	title: string;
	ariaLabel: string;
	icon: ReactNode;
	disabled?: boolean;
	initialValue: string;
	placeholder: string;
	confirmLabel: string;
	canConfirm: (value: string) => boolean;
	onConfirm: (value: string) => boolean;
}

function GroupTagPopover({
	title,
	ariaLabel,
	icon,
	disabled = false,
	initialValue,
	placeholder,
	confirmLabel,
	canConfirm,
	onConfirm,
}: GroupTagPopoverProps) {
	const [open, setOpen] = useState(false);
	const [draftValue, setDraftValue] = useState(initialValue);
	const recipe = useSlotRecipe({ recipe: groupsRecipe });
	const styles = recipe();
	const canSubmit = canConfirm(draftValue);

	const handleOpenChange = (details: { open: boolean }) => {
		setOpen(details.open);
		if (details.open) {
			setDraftValue(initialValue);
		}
	};
	const handleCancel = () => {
		setOpen(false);
		setDraftValue(initialValue);
	};
	const handleConfirm = () => {
		if (!canSubmit || !onConfirm(draftValue)) {
			return;
		}

		setOpen(false);
		setDraftValue(initialValue);
	};
	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") {
			return;
		}

		event.preventDefault();
		handleConfirm();
	};

	return (
		<Popover.Root
			open={open}
			onOpenChange={handleOpenChange}
			positioning={{
				placement: "top-end",
				offset: { mainAxis: 10, crossAxis: 0 },
			}}
			lazyMount
			unmountOnExit
		>
			<Popover.Trigger asChild>
				<IconButton
					type="button"
					aria-label={ariaLabel}
					title={ariaLabel}
					size="xs"
					variant="ghost"
					css={styles.iconButton}
					disabled={disabled}
				>
					{icon}
				</IconButton>
			</Popover.Trigger>

			<Portal>
				<DarkMode>
					<Popover.Positioner>
						<Popover.Content css={styles.popoverContent}>
							<Popover.Arrow css={styles.popoverArrow} />
							<Popover.Body css={styles.popoverBody}>
								<Text css={styles.popoverTitle}>{title}</Text>
								<Input
									aria-label={title}
									value={draftValue}
									placeholder={placeholder}
									css={styles.popoverInput}
									onChange={(event) => setDraftValue(event.currentTarget.value)}
									onKeyDown={handleKeyDown}
								/>
								<HStack css={styles.popoverActions}>
									<Button
										type="button"
										size="xs"
										variant="ghost"
										css={styles.popoverButton}
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button
										type="button"
										size="xs"
										variant="surface"
										colorPalette="cyan"
										css={styles.popoverButton}
										disabled={!canSubmit}
										onClick={handleConfirm}
									>
										{confirmLabel}
									</Button>
								</HStack>
							</Popover.Body>
						</Popover.Content>
					</Popover.Positioner>
				</DarkMode>
			</Portal>
		</Popover.Root>
	);
}

export default function Groups() {
	const model = useGroups();
	const recipe = useSlotRecipe({ recipe: groupsRecipe });
	const styles = recipe();
	const selectedGroup = model.selectedGroup;
	const groupCollection = useMemo(
		() =>
			createListCollection({
				items: model.groupOptions.map((option) => ({
					label:
						option.value === ALL_GROUPS_VALUE
							? option.label
							: `${option.label} (${option.memberCount})`,
					value: option.value,
				})),
			}),
		[model.groupOptions],
	);

	return (
		<Box css={styles.root}>
			<HStack css={styles.titleRow}>
				<Text css={styles.title}>Groups</Text>
				<Text css={styles.countBadge}>{model.selectedGroupMemberCount}</Text>
			</HStack>

			<Box css={styles.toolbar}>
				<Select.Root
					collection={groupCollection}
					size="xs"
					value={[model.selectedValue]}
					css={styles.selectRoot}
					positioning={{ sameWidth: true, placement: "bottom-start" }}
					onValueChange={(details) =>
						model.onSelectGroupValue(details.value[0] ?? ALL_GROUPS_VALUE)
					}
				>
					<Select.HiddenSelect />
					<Select.Control css={styles.selectControl}>
						<Select.Trigger css={styles.selectTrigger}>
							<Select.ValueText placeholder="Group" />
						</Select.Trigger>
						<Select.IndicatorGroup>
							<Select.Indicator />
						</Select.IndicatorGroup>
					</Select.Control>
					<Portal>
						<DarkMode>
							<Select.Positioner>
								<Select.Content css={styles.selectContent}>
									{groupCollection.items.map((option) => (
										<Select.Item
											key={option.value}
											item={option}
											css={styles.selectItem}
										>
											<Select.ItemText>{option.label}</Select.ItemText>
											<Select.ItemIndicator />
										</Select.Item>
									))}
								</Select.Content>
							</Select.Positioner>
						</DarkMode>
					</Portal>
				</Select.Root>

				<HStack css={styles.actionGroup}>
					<ProjectionControls
						isOverviewVisible={selectedGroup?.overviewVisibility ?? false}
						isInspectorVisible={selectedGroup?.inspectorVisibility ?? false}
						disabled={!selectedGroup}
						onToggleOverview={() => model.onToggleGroupVisibility("overview")}
						onToggleInspector={() => model.onToggleGroupVisibility("inspector")}
					/>
					<GroupTagPopover
						title="Create group"
						ariaLabel="Create group"
						icon={<Plus size={GROUP_ACTION_ICON_SIZE} />}
						initialValue=""
						placeholder="new tag"
						confirmLabel="Create"
						canConfirm={model.canCreateGroupTag}
						onConfirm={model.onCreateGroup}
					/>
					<GroupTagPopover
						title="Rename group"
						ariaLabel="Rename selected group"
						icon={<Pencil size={GROUP_ACTION_ICON_SIZE} />}
						disabled={!selectedGroup}
						initialValue={selectedGroup?.tag ?? ""}
						placeholder="group tag"
						confirmLabel="Rename"
						canConfirm={model.canRenameGroupTag}
						onConfirm={model.onRenameGroup}
					/>
					<Tooltip content="Delete selected group" showArrow>
						<IconButton
							type="button"
							aria-label="Delete selected group"
							size="xs"
							variant="ghost"
							css={styles.iconButton}
							disabled={!model.canDeleteGroup}
							onClick={model.onDeleteGroup}
						>
							<Trash2 size={GROUP_ACTION_ICON_SIZE} />
						</IconButton>
					</Tooltip>
				</HStack>
			</Box>
		</Box>
	);
}
