import {
	Button,
	Combobox,
	createListCollection,
	Dialog,
	Portal,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { canSaveSpectrumWorkspaceEmissionLinePreset } from "../utils";

export interface PresetRowProps {
	presetNames: string[];
	selectedPresetName: string | null;
	selectedLineIds: string[];
	presetLineIds: string[];
	onSelectPreset: (name: string | null) => void;
	onSavePreset: (name: string) => void;
	onDeletePreset: (name: string) => void;
}

export function PresetRow({
	presetNames,
	selectedPresetName,
	selectedLineIds,
	presetLineIds,
	onSelectPreset,
	onSavePreset,
	onDeletePreset,
}: PresetRowProps) {
	const [presetNameDraft, setPresetNameDraft] = useState(
		selectedPresetName ?? "",
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const filteredPresetNames = useMemo(() => {
		const searchValue = presetNameDraft.trim().toLowerCase();
		if (!searchValue) {
			return presetNames;
		}

		return presetNames.filter((presetName) =>
			presetName.toLowerCase().includes(searchValue),
		);
	}, [presetNameDraft, presetNames]);
	const collection = useMemo(
		() =>
			createListCollection({
				items: filteredPresetNames.map((presetName) => ({
					label: presetName,
					value: presetName,
				})),
			}),
		[filteredPresetNames],
	);
	const canSave = canSaveSpectrumWorkspaceEmissionLinePreset({
		draftName: presetNameDraft,
		selectedPresetName,
		selectedLineIds,
		presetLineIds,
	});
	const canDelete = selectedPresetName !== null;

	return (
		<Stack gap={3}>
			<Text fontSize="sm" fontWeight="semibold">
				Preset
			</Text>

			<Stack direction={{ base: "column", md: "row" }} gap={3} align="end">
				<Stack flex="1" gap={1} minW={0}>
					<Text fontSize="xs" fontWeight="medium" color="fg.muted">
						Select or name a preset
					</Text>
					<Combobox.Root
						collection={collection}
						openOnClick
						inputValue={presetNameDraft}
						value={selectedPresetName ? [selectedPresetName] : []}
						onInputValueChange={({ inputValue }) =>
							setPresetNameDraft(inputValue)
						}
						onValueChange={({ value }) => {
							const nextValue = value[0] ?? null;
							onSelectPreset(nextValue);
							setPresetNameDraft(nextValue ?? "");
						}}
					>
						<Combobox.Control>
							<Combobox.Input placeholder="Choose or create a preset" />
							<Combobox.IndicatorGroup>
								<Combobox.Trigger />
							</Combobox.IndicatorGroup>
						</Combobox.Control>

						<Portal>
							<Combobox.Positioner>
								<Combobox.Content>
									<Combobox.Empty>No presets found</Combobox.Empty>
									{collection.items.map((item) => (
										<Combobox.Item key={item.value} item={item}>
											<Combobox.ItemText>{item.label}</Combobox.ItemText>
											<Combobox.ItemIndicator />
										</Combobox.Item>
									))}
								</Combobox.Content>
							</Combobox.Positioner>
						</Portal>
					</Combobox.Root>
				</Stack>

				<Stack direction="row" gap={2} justify="end">
					<Button
						size="xs"
						disabled={!canSave}
						onClick={() => {
							if (!canSave) {
								return;
							}

							const nextName = presetNameDraft.trim();
							onSavePreset(nextName);
							setPresetNameDraft(nextName);
						}}
					>
						Save
					</Button>

					<Button
						size="xs"
						variant="outline"
						colorPalette="red"
						disabled={!canDelete}
						onClick={() => {
							if (canDelete) {
								setDeleteDialogOpen(true);
							}
						}}
					>
						Delete
					</Button>
				</Stack>
			</Stack>

			<Dialog.Root
				lazyMount
				role="alertdialog"
				open={deleteDialogOpen}
				onOpenChange={({ open }) => setDeleteDialogOpen(open)}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Delete Preset</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text fontSize="sm" color="fg.muted">
									Delete preset `{selectedPresetName ?? ""}`? This removes the
									preset definition only.
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button size="sm" variant="outline">
										Cancel
									</Button>
								</Dialog.ActionTrigger>
								<Button
									size="sm"
									colorPalette="red"
									onClick={() => {
										if (!selectedPresetName) {
											return;
										}

										onDeletePreset(selectedPresetName);
										setPresetNameDraft("");
										setDeleteDialogOpen(false);
									}}
								>
									Delete
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</Stack>
	);
}
