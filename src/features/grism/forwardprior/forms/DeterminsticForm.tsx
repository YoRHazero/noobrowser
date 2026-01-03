"use client";

import {
	Box,
	createListCollection,
	Grid,
	HStack,
	Listbox,
	SegmentGroup,
	Stack,
	Text,
	useListbox,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { CompactNumberInput } from "@/components/ui/compact-number-input";
import type {
	BaseFitModel,
	DeterministicPrior,
	FitModelType,
} from "@/stores/stores-types";

interface DeterministicFormProps {
	config: DeterministicPrior;
	onChange: (config: DeterministicPrior) => void;
	allModels: BaseFitModel[];
	currentModelId: number;
	paramName: string;
}

const getModelParams = (kind: FitModelType) => {
	if (kind === "gaussian") {
		return [
			{ label: "A", value: "amplitude" },
			{ label: "µ", value: "mu" },
			{ label: "σ", value: "sigma" },
		];
	}
	// linear
	return [
		{ label: "k", value: "k" },
		{ label: "b", value: "b" },
		{ label: "x₀", value: "x0" },
	];
};

export default function DeterministicForm(props: DeterministicFormProps) {
	const { config, onChange, allModels, currentModelId, paramName } = props;
	const currentModel = allModels.find((m) => m.id === currentModelId);
	// 1. Model Collection
	const modelCollection = useMemo(() => {
		const items = allModels.map((model) => ({
			label: model.name,
			value: String(model.id),
		}));
		return createListCollection({ items });
	}, [allModels]);

	// 2. Param Collection (在数据源中定义 disabled)
	const selectedRefModel = allModels.find((m) => m.id === config.refModelId);

	const paramCollection = useMemo(() => {
		const items = !selectedRefModel
			? []
			: getModelParams(selectedRefModel.kind).map((param) => ({
					label: param.label,
					value: param.value,
					// 核心修改：在 Item 数据对象中设置 disabled
					disabled:
						selectedRefModel.id === currentModelId && param.value === paramName,
				}));
		return createListCollection({ items });
	}, [selectedRefModel, currentModelId, paramName]);

	// 3. 处理模型变更
	const handleModelChange = (details: { value: string[] }) => {
		const newModelId = Number(details.value[0]);

		// 核心修改：切换模型时，直接将 refParam 置空
		onChange({
			...config,
			refModelId: newModelId,
			refParam: undefined,
		});
	};

	// 4. 配置 Listbox Hooks (受控模式)
	const modelListbox = useListbox({
		collection: modelCollection,
		value: [String(config.refModelId)],
		onValueChange: handleModelChange,
	});

	const paramListbox = useListbox({
		collection: paramCollection,
		// 如果 refParam 为 undefined，传入空数组
		value: config.refParam ? [config.refParam] : [],
		onValueChange: (d) => onChange({ ...config, refParam: d.value[0] }),
	});

	return (
		<Stack gap={5}>
			<Grid templateColumns="1fr 1fr" gap={4}>
				{/* Model Listbox */}
				<Listbox.RootProvider value={modelListbox} h="100px">
					<Listbox.Label fontSize="xs" fontWeight="medium" color="fg.muted">
						Reference Model
					</Listbox.Label>
					<Listbox.Content>
						{modelCollection.items.map((item) => (
							<Listbox.Item key={item.value} item={item}>
								<Listbox.ItemText>{item.label}</Listbox.ItemText>
								<Listbox.ItemIndicator />
							</Listbox.Item>
						))}
					</Listbox.Content>
				</Listbox.RootProvider>

				{/* Parameter Listbox */}
				<Listbox.RootProvider value={paramListbox} h="100px">
					<Listbox.Label fontSize="xs" fontWeight="medium" color="fg.muted">
						Parameter
					</Listbox.Label>
					<Listbox.Content>
						{paramCollection.items.length > 0 ? (
							paramCollection.items.map((item) => (
								<Listbox.Item
									key={item.value}
									item={item}
									// 核心修改：不再手动传递 disabled，Listbox 会读取 item.disabled
									_disabled={{
										opacity: 0.5,
										cursor: "not-allowed",
										textDecoration: "line-through",
									}}
								>
									<Listbox.ItemText>{item.label}</Listbox.ItemText>
									<Listbox.ItemIndicator />
								</Listbox.Item>
							))
						) : (
							<Box p={2} fontSize="xs" color="fg.muted">
								Select a model first
							</Box>
						)}
					</Listbox.Content>
				</Listbox.RootProvider>
			</Grid>

			{/* Operation Controls */}
			<HStack align="end" gap={3}>
				<Stack gap={1}>
					<Text fontSize="xs" fontWeight="medium" color="fg.muted">
						Operation
					</Text>
					<SegmentGroup.Root
						value={config.mode}
						onValueChange={(d) =>
							onChange({ ...config, mode: d.value as "add" | "multiply" })
						}
						size="sm"
						width="80px"
					>
						<SegmentGroup.Indicator />
						<SegmentGroup.Item value="add" flex={1}>
							<SegmentGroup.ItemText>+</SegmentGroup.ItemText>
							<SegmentGroup.ItemHiddenInput />
						</SegmentGroup.Item>
						<SegmentGroup.Item value="multiply" flex={1}>
							<SegmentGroup.ItemText>×</SegmentGroup.ItemText>
							<SegmentGroup.ItemHiddenInput />
						</SegmentGroup.Item>
					</SegmentGroup.Root>
				</Stack>
				<Box flex={1}>
					<CompactNumberInput
						label="Value"
						value={config.value}
						onChange={(v) => onChange({ ...config, value: v })}
						decimalScale={4}
					/>
				</Box>
			</HStack>
			<HStack bg="bg.muted" justify="space-between">
				<Text fontSize="xs">Preview:</Text>
				<PreviewFormula
					currentModel={currentModel}
					paramName={paramName}
					refModel={selectedRefModel}
					config={config}
				/>
			</HStack>
		</Stack>
	);
}

function PreviewFormula({
	currentModel,
	paramName,
	refModel,
	config,
}: {
	currentModel: BaseFitModel | undefined;
	paramName: string;
	refModel: BaseFitModel | undefined;
	config: DeterministicPrior;
}) {
	if (!currentModel) {
		return <Text fontSize="xs">N/A</Text>;
	}
	const currentParamLabel =
		getModelParams(currentModel.kind).find((p) => p.value === paramName)
			?.label || paramName;

	const operationSymbol = config.mode === "add" ? "+" : "×";

	const isRefParamUndefined = !config.refParam;
	const isValidSameParam =
		isRefParamUndefined &&
		refModel?.kind === currentModel.kind &&
		refModel?.id !== currentModel.id;

	return (
		<Text fontSize="xs">
			{isRefParamUndefined ? (
				isValidSameParam ? (
					<>
						{currentModel.name}-{currentParamLabel} = {refModel?.name}-
						{currentParamLabel} {operationSymbol} {config.value}
					</>
				) : (
					"Invalid Reference Parameter, choose a specific parameter."
				)
			) : (
				<>
					{currentParamLabel}@{currentModel.name} = {config.refParam}@
					{refModel?.name} {operationSymbol} {config.value}
				</>
			)}
		</Text>
	);
}
