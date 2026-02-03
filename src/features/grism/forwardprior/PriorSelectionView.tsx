"use client";

import {
	Box,
	createListCollection,
	Flex,
	Icon,
	Listbox,
	Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { LuCheck } from "react-icons/lu";

import Latex from "@/components/ui/latex";
import type { FitModel } from "@/stores/stores-types";
import { getModelParamValue } from "@/stores/stores-utils";

interface PriorSelectionViewProps {
	allModels: FitModel[];
	selectedModelId: number | null;
	selectedParam: string | null;
	onSelectModel: (id: number) => void;
	onSelectParam: (param: string) => void;
}

const LINEAR_PARAMS = ["k", "b"]; // x0 excluded
const GAUSSIAN_PARAMS = ["amplitude", "mu", "sigma"];

const PARAM_DISPLAY_MAP: Record<string, string> = {
	amplitude: "A",
	mu: "µ",
	sigma: "σ",
	k: "k",
	b: "b",
};

const getModelFormula = (kind: string) => {
	switch (kind) {
		case "linear":
			return `y = k(x - x_0) + b`;
		case "gaussian":
			return String.raw`y = A \exp \left( -\frac{(x - \mu)^2}{2\sigma^2} \right)`;
		default:
			return kind;
	}
};

interface ModelOption {
	label: string;
	value: string;
	formula: string;
	hasPriors: boolean;
}

interface ParamOption {
	label: string;
	value: string;
	isConfigured: boolean;
}

export default function PriorSelectionView(props: PriorSelectionViewProps) {
	const {
		allModels,
		selectedModelId,
		selectedParam,
		onSelectModel,
		onSelectParam,
	} = props;

	// 1. 创建 Models Collection
	const modelsCollection = useMemo(() => {
		return createListCollection<ModelOption>({
			items: allModels.map((model) => ({
				label: model.name,
				value: String(model.id),
				formula: getModelFormula(model.kind),
				hasPriors: !!(model.priors && Object.keys(model.priors).length > 0),
			})),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		});
	}, [allModels]);

	// 2. 创建 Parameters Collection
	const paramsCollection = useMemo(() => {
		const selectedModel = allModels.find((m) => m.id === selectedModelId);
		const params = selectedModel
			? selectedModel.kind === "linear" ? LINEAR_PARAMS : GAUSSIAN_PARAMS
			: [];

		return createListCollection<ParamOption>({
			items: params.map((param) => ({
				label: PARAM_DISPLAY_MAP[param] || param,
				value: param,
				isConfigured: !!(
					selectedModel?.priors &&
					getModelParamValue(selectedModel, param) !== undefined
				),
			})),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		});
	}, [allModels, selectedModelId]);

	return (
		<Flex w="full" h="full" gap={3}>
			{/* === Column 1: Models === */}
			<Listbox.Root
				collection={modelsCollection}
				value={selectedModelId ? [String(selectedModelId)] : []}
				onValueChange={(e) => onSelectModel(Number(e.value[0]))}
			>
				<Flex
					direction="column"
					h="full"
					flex={1}
					borderWidth="1px"
					borderRadius="md"
					borderColor="border.subtle"
					bg="bg.subtle"
					overflow="hidden"
				>
					<Box
						p={2}
						bg="bg.muted"
						borderBottomWidth="1px"
						borderColor="border.subtle"
					>
						<Text fontSize="xs" fontWeight="bold" color="fg.muted">
							MODELS
						</Text>
					</Box>

					<Listbox.Content bg="transparent" flex="1" overflowY="auto" p={1}>
						{modelsCollection.items.length === 0 ? (
							<Box p={4} textAlign="center">
								<Text fontSize="xs" color="fg.muted">
									No models
								</Text>
							</Box>
						) : (
							modelsCollection.items.map((item) => (
								<Listbox.Item
									key={item.value}
									item={item}
									px={3}
									py={2}
									mb={1}
									borderRadius="sm"
									cursor="pointer"
									_hover={{ bg: "bg.emphasized" }}
									_selected={{ bg: "bg.emphasized", boxShadow: "xs" }}
									justifyContent="space-between"
								>
									<Box overflow="hidden">
										<Listbox.ItemText fontWeight="medium" fontSize="sm">
											{item.label}
										</Listbox.ItemText>
										{/* 公式显示 */}
										<Box fontSize="xs" color="fg.muted" mt={0.5}>
											<Latex>{item.formula}</Latex>
										</Box>
									</Box>

									{/* Prior 状态指示点 */}
									{item.hasPriors && (
										<Icon color="teal.500" size="xs" ml={2}>
											<LuCheck />
										</Icon>
									)}
								</Listbox.Item>
							))
						)}
					</Listbox.Content>
				</Flex>
			</Listbox.Root>

			{/* === Column 2: Parameters === */}
			<Listbox.Root
				collection={paramsCollection}
				value={selectedParam ? [selectedParam] : []}
				onValueChange={(e) => onSelectParam(e.value[0])}
				disabled={!selectedModelId}
			>
				<Flex
					direction="column"
					h="full"
					flex={1}
					borderWidth="1px"
					borderRadius="md"
					borderColor="border.subtle"
					bg="bg.surface"
					overflow="hidden"
				>
					<Box
						p={2}
						bg="bg.muted"
						borderBottomWidth="1px"
						borderColor="border.subtle"
					>
						<Text fontSize="xs" fontWeight="bold" color="fg.muted">
							PARAMETERS
						</Text>
					</Box>

					<Listbox.Content bg="transparent" flex="1" overflowY="auto" p={1}>
						{!selectedModelId ? (
							<Box p={4} textAlign="center">
								<Text fontSize="xs" color="fg.muted">
									Select a model
								</Text>
							</Box>
						) : (
							paramsCollection.items.map((item) => (
								<Listbox.Item
									key={item.value}
									item={item}
									px={3}
									mb={0.5}
									borderRadius="sm"
									cursor="pointer"
									_hover={{ bg: "teal.subtle" }}
									_selected={{ bg: "teal.subtle", color: "teal.fg" }}
									justifyContent="space-between"
								>
									{/* 使用 Latex 渲染参数名 (如 µ) */}
									<Box fontSize="sm" fontWeight="medium">
										{item.label}
									</Box>

									{/* 配置状态指示勾 */}
									{item.isConfigured && (
										<Listbox.ItemIndicator>
											<LuCheck />
										</Listbox.ItemIndicator>
									)}
								</Listbox.Item>
							))
						)}
					</Listbox.Content>
				</Flex>
			</Listbox.Root>
		</Flex>
	);
}
