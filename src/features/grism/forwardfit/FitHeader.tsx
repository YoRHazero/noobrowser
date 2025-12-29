"use client";

import {
	Button,
	createListCollection,
	Heading,
	HStack,
	Portal,
	Select,
} from "@chakra-ui/react";
import { useId, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { FitModelType } from "@/stores/stores-types";

const modelTypes = createListCollection({
	items: [
		{ label: "Linear", value: "linear" },
		{ label: "Gaussian", value: "gaussian" },
	],
});

export default function FitHeader() {
	const syncId = useId();

	const {
		addModel,
		models,
		saveCurrentConfiguration,
		updateModel,
	} = useFitStore(
		useShallow((s) => ({
			addModel: s.addModel,
			models: s.models,
			saveCurrentConfiguration: s.saveCurrentConfiguration,
			updateModel: s.updateModel,
		})),
	);

	const { slice1DWaveRange } = useGrismStore(
		useShallow((s) => ({
			slice1DWaveRange: s.slice1DWaveRange,
		})),
	);

	const [selectedType, setSelectedType] = useState<string[]>(["linear"]);

	const handleAdd = () => {
		addModel((selectedType[0] as FitModelType) ?? "linear", slice1DWaveRange);
	};

	const syncModelToWindow = () => {
		if (models.length === 0) return;

		models.forEach((model) => {
			if (model.kind === "gaussian") {
				const mu = (slice1DWaveRange.min + slice1DWaveRange.max) / 2;
				updateModel(model.id, { range: slice1DWaveRange, mu });
			} else if (model.kind === "linear") {
				const x0 = (slice1DWaveRange.min + slice1DWaveRange.max) / 2;
				updateModel(model.id, { range: slice1DWaveRange, x0 });
			}
		});
		toaster.success({
			title: "Models Synced",
			description: "Models updated to current slice window",
		});
	};

	// 逻辑：保存配置
	const handleSave = () => {
		saveCurrentConfiguration();
		toaster.create({ title: "Saved", type: "success" });
	};

	return (
		<HStack justify="space-between" align="center">
			<Heading size="sm">Model Fitting</Heading>
			<HStack gap={2}>
				<Select.Root
					collection={modelTypes}
					size="xs"
					width="90px"
					value={selectedType}
					onValueChange={(d) => setSelectedType(d.value)}
				>
					<Select.HiddenSelect />
					<Select.Control>
						<Select.Trigger>
							<Select.ValueText />
						</Select.Trigger>
					</Select.Control>
					<Portal>
						<Select.Positioner>
							<Select.Content>
								{modelTypes.items.map((item) => (
									<Select.Item key={item.value} item={item}>
										<Select.ItemText>{item.label}</Select.ItemText>
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
					</Portal>
				</Select.Root>

				<Button size="xs" onClick={handleAdd}>
					Add
				</Button>

				<Tooltip
					ids={{ trigger: syncId }}
					content="Update all models to match current slice range"
				>
					<Button
						size="xs"
						variant="outline"
						onClick={syncModelToWindow}
						disabled={models.length === 0}
					>
						Sync
					</Button>
				</Tooltip>

				<Tooltip content="Save configuration">
					<Button size="xs" onClick={handleSave}>
						Save
					</Button>
				</Tooltip>
			</HStack>
		</HStack>
	);
}