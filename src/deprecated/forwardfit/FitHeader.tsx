"use client";

import {
	Box,
	Button,
	createListCollection,
	Heading,
	HStack,
	Portal,
	Select,
} from "@chakra-ui/react";
import { useId, useState } from "react";
import { LuPlus, LuRefreshCw, LuSave } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";

import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { FitModelType } from "@/stores/stores-types";

// --- Theme Constants ---
const THEME_STYLES = {
	heading: {
		size: "sm" as const,
		letterSpacing: "wide",
		fontWeight: "extrabold",
		textTransform: "uppercase" as const,

		color: { base: "gray.700", _dark: "transparent" },
		bgGradient: { base: "none", _dark: "to-r" },
		gradientFrom: { _dark: "cyan.400" },
		gradientTo: { _dark: "purple.500" },
		bgClip: { base: "border-box", _dark: "text" },
	},
	selectTrigger: {
		bg: { base: "white", _dark: "whiteAlpha.100" },
		borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
		color: "fg",
		fontSize: "xs",
		transition: "all 0.2s",
		_hover: {
			borderColor: "cyan.400",
			bg: { base: "gray.50", _dark: "whiteAlpha.200" },
		},
		_focus: {
			borderColor: "cyan.500",
			boxShadow: "0 0 0 1px var(--chakra-colors-cyan-500)",
		},
	},
	selectContent: {
		bg: "bg.panel",
		borderColor: "border.subtle",
		backdropFilter: "blur(10px)",
		_dark: {
			bg: "rgba(20, 20, 25, 0.95)",
			borderColor: "whiteAlpha.200",
		},
	},
	selectItem: {
		cursor: "pointer" as const,
		transition: "all 0.1s ease-out",
		borderRadius: "sm",

		_hover: {
			bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			color: { base: "cyan.600", _dark: "cyan.400" },
		},
		_highlighted: {
			bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			color: { base: "cyan.600", _dark: "cyan.400" },
		},
		_focus: {
			bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			color: { base: "cyan.600", _dark: "cyan.400" },
		},
	},
	iconButton: {
		size: "xs" as const,
		variant: "ghost" as const,
		color: "fg.muted",
		_hover: {
			color: "cyan.400",
			bg: { base: "gray.100", _dark: "whiteAlpha.100" },
		},
	},
	addButton: {
		size: "xs" as const,
		variant: "surface" as const,
		colorPalette: "cyan",
		fontWeight: "semibold",
	},
};

const modelTypes = createListCollection({
	items: [
		{ label: "Linear", value: "linear" },
		{ label: "Gaussian", value: "gaussian" },
	],
});

export default function FitHeader() {
	const syncId = useId();

	const { addModel, models, saveCurrentConfiguration, updateModel } =
		useFitStore(
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

	const handleSave = () => {
		saveCurrentConfiguration();
		toaster.create({ title: "Configuration Saved", type: "success" });
	};

	return (
		<HStack justify="space-between" align="center">
			<Heading {...THEME_STYLES.heading}>Model Fitting</Heading>

			<HStack gap={2}>
				<Box position="relative">
					<Select.Root
						collection={modelTypes}
						size="xs"
						width="100px"
						value={selectedType}
						onValueChange={(d) => setSelectedType(d.value)}
					>
						<Select.HiddenSelect />
						<Select.Control {...THEME_STYLES.selectTrigger}>
							<Select.Trigger>
								<Select.ValueText placeholder="Type" />
							</Select.Trigger>
						</Select.Control>
						<Portal>
							<Select.Positioner>
								<Select.Content {...THEME_STYLES.selectContent}>
									{modelTypes.items.map((item) => (
										<Select.Item
											key={item.value}
											item={item}
											{...THEME_STYLES.selectItem}
										>
											<Select.ItemText>{item.label}</Select.ItemText>
										</Select.Item>
									))}
								</Select.Content>
							</Select.Positioner>
						</Portal>
					</Select.Root>
				</Box>

				<Button {...THEME_STYLES.addButton} onClick={handleAdd}>
					<LuPlus /> Add
				</Button>

				<Tooltip ids={{ trigger: syncId }} content="Sync to Viewport">
					<Button
						{...THEME_STYLES.iconButton}
						onClick={syncModelToWindow}
						disabled={models.length === 0}
					>
						<LuRefreshCw />
					</Button>
				</Tooltip>

				<Tooltip content="Save Configuration">
					<Button {...THEME_STYLES.iconButton} onClick={handleSave}>
						<LuSave />
					</Button>
				</Tooltip>
			</HStack>
		</HStack>
	);
}
