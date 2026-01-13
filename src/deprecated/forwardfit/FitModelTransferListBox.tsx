"use client";

import {
	createListCollection,
	HStack,
	IconButton,
	Listbox,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";
import type { FitModel } from "@/stores/stores-types";

interface ModelOption {
	label: string;
	value: string;
	kind: string;
}

interface FitListBoxPanelProps {
	title: string;
	models: FitModel[];
	selectedValues: string[];
	onSelectedValuesChange: (values: string[]) => void;
}

function FitListBoxPanel(props: FitListBoxPanelProps) {
	const { title, models, selectedValues, onSelectedValuesChange } = props;

	const collection = useMemo(() => {
		return createListCollection<ModelOption>({
			items: models.map((model) => ({
				label: model.name,
				value: String(model.id),
				kind: model.kind,
			})),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
			// 按类型分组
			groupBy: (item) =>
				item.kind === "linear" ? "Linear Models" : "Gaussian Models",
		});
	}, [models]);

	return (
		<Listbox.Root
			collection={collection}
			selectionMode="multiple"
			value={selectedValues}
			onValueChange={(d) => onSelectedValuesChange(d.value)}
			width="160px"
		>
			<Listbox.Label fontSize="xs" color="fg.muted" fontWeight="semibold">
				{title}
			</Listbox.Label>
			<Listbox.Content
				maxH="120px"
				minH="120px"
				overflowY="auto"
				bg="bg.subtle"
				borderRadius="md"
				borderWidth="1px"
				p={0}
			>
				{collection.items.length > 0 ? (
					collection.group().map(([groupLabel, items]) => (
						<Listbox.ItemGroup key={groupLabel}>
							<Listbox.ItemGroupLabel
								px={2}
								py={1}
								fontSize="2xs"
								color="fg.muted"
								bg="bg.muted"
								fontWeight="bold"
							>
								{groupLabel}
							</Listbox.ItemGroupLabel>
							{items.map((item) => (
								<Listbox.Item
									key={item.value}
									item={item}
									px={2}
									py={1}
									_hover={{ bg: "bg.emphasized" }}
									_selected={{ bg: "teal.subtle", color: "teal.fg" }}
								>
									<Listbox.ItemText fontSize="xs">
										{item.label}
									</Listbox.ItemText>
									<Listbox.ItemIndicator />
								</Listbox.Item>
							))}
						</Listbox.ItemGroup>
					))
				) : (
					<Stack align="center" justify="center" h="full" color="fg.muted">
						<Text fontSize="xs" opacity={0.5}>
							Empty
						</Text>
					</Stack>
				)}
			</Listbox.Content>
		</Listbox.Root>
	);
}

export default function FitModelTransferListBox() {
	const { models, updateModel } = useFitStore(
		useShallow((s) => ({ models: s.models, updateModel: s.updateModel })),
	);

	const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
	const [selectedRight, setSelectedRight] = useState<string[]>([]);

	const leftModels = useMemo(
		() => models.filter((model) => !model.subtracted),
		[models],
	);
	const rightModels = useMemo(
		() => models.filter((model) => model.subtracted),
		[models],
	);

	const move = (ids: string[], toSubtracted: boolean) => {
		for (const modelId of ids) {
			updateModel(Number(modelId), { subtracted: toSubtracted });
		}
		toSubtracted ? setSelectedLeft([]) : setSelectedRight([]);
	};

	return (
		<HStack justify="center" align="end" gap={2}>
			<FitListBoxPanel
				title="Model to draw"
				models={leftModels}
				selectedValues={selectedLeft}
				onSelectedValuesChange={setSelectedLeft}
			/>
			<Stack gap={1} pb={8}>
				<IconButton
					aria-label="Move to subtract"
					size="xs"
					variant="ghost"
					disabled={selectedLeft.length === 0}
					onClick={() => move(selectedLeft, true)}
				>
					<LuChevronRight />
				</IconButton>
				<IconButton
					aria-label="Move to draw"
					size="xs"
					variant="ghost"
					disabled={selectedRight.length === 0}
					onClick={() => move(selectedRight, false)}
				>
					<LuChevronLeft />
				</IconButton>
			</Stack>
			<FitListBoxPanel
				title="Model to subtract"
				models={rightModels}
				selectedValues={selectedRight}
				onSelectedValuesChange={setSelectedRight}
			/>
		</HStack>
	);
}
