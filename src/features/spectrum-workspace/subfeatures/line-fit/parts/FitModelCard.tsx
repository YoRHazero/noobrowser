import {
	Box,
	HStack,
	IconButton,
	Input,
	SegmentGroup,
	Stack,
	Switch,
	Text,
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasFitModelPatch,
} from "@/canvas/spectrum1dCanvas";
import Latex from "@/components/ui/latex";
import { Tooltip } from "@/components/ui/tooltip";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";
import { fromLineFitDisplayWavelength, fwhmKmSToSigmaUm } from "../utils";
import type { FitEditingParameter } from "./FitModelList";
import type { FitModelParameterKey } from "./FitParameterEditorRow";
import { FitParameterEditorRow } from "./FitParameterEditorRow";
import { GaussianParameterDisplay } from "./GaussianParameterDisplay";
import { LinearParameterDisplay } from "./LinearParameterDisplay";

function getFormula(model: Spectrum1DCanvasFitModel): string {
	return model.kind === "gaussian"
		? String.raw`y = A \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\quad x_1 < x < x_2`
		: String.raw`y = k(x-x_0)+b,\quad x_1 < x < x_2`;
}

function getUnitLabel(
	key: FitModelParameterKey,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"wavelengthUnit" | "wavelengthFrame"
	>,
): string | undefined {
	if (key === "fwhmKmS") {
		return "km/s";
	}

	if (
		key === "muUm" ||
		key === "sigmaUm" ||
		key === "rangeMinUm" ||
		key === "rangeMaxUm" ||
		key === "x0Um"
	) {
		return display.wavelengthUnit === "um" ? "um" : "A";
	}

	return undefined;
}

function buildPatch({
	model,
	parameterKey,
	value,
	display,
}: {
	model: Spectrum1DCanvasFitModel;
	parameterKey: FitModelParameterKey;
	value: number;
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
}): Spectrum1DCanvasFitModelPatch | null {
	if (model.kind === "gaussian") {
		if (parameterKey === "amplitude") {
			return { kind: "gaussian", patch: { amplitude: value } };
		}
		if (parameterKey === "muUm") {
			return {
				kind: "gaussian",
				patch: { muUm: fromLineFitDisplayWavelength(value, display) },
			};
		}
		if (parameterKey === "sigmaUm") {
			return {
				kind: "gaussian",
				patch: {
					sigmaUm: Math.abs(fromLineFitDisplayWavelength(value, display)),
				},
			};
		}
		if (parameterKey === "fwhmKmS") {
			const sigmaUm = fwhmKmSToSigmaUm(model.muUm, value);
			return sigmaUm === null ? null : { kind: "gaussian", patch: { sigmaUm } };
		}
		if (parameterKey === "rangeMinUm") {
			return {
				kind: "gaussian",
				patch: {
					range: {
						...model.range,
						minUm: fromLineFitDisplayWavelength(value, display),
					},
				},
			};
		}
		if (parameterKey === "rangeMaxUm") {
			return {
				kind: "gaussian",
				patch: {
					range: {
						...model.range,
						maxUm: fromLineFitDisplayWavelength(value, display),
					},
				},
			};
		}
		return null;
	}

	if (parameterKey === "k") {
		return { kind: "linear", patch: { k: value } };
	}
	if (parameterKey === "b") {
		return { kind: "linear", patch: { b: value } };
	}
	if (parameterKey === "x0Um") {
		return {
			kind: "linear",
			patch: { x0Um: fromLineFitDisplayWavelength(value, display) },
		};
	}
	if (parameterKey === "rangeMinUm") {
		return {
			kind: "linear",
			patch: {
				range: {
					...model.range,
					minUm: fromLineFitDisplayWavelength(value, display),
				},
			},
		};
	}
	if (parameterKey === "rangeMaxUm") {
		return {
			kind: "linear",
			patch: {
				range: {
					...model.range,
					maxUm: fromLineFitDisplayWavelength(value, display),
				},
			},
		};
	}

	return null;
}

export function FitModelCard({
	model,
	display,
	editingParameter,
	draftValue,
	onDraftValueChange,
	onStartEditingParameter,
	onStopEditingParameter,
	onUpdateModel,
	onCommitModelEdit,
	onRenameModel,
	onSetModelColor,
	onDeleteModel,
	onToggleModelActive,
	onToggleModelSubtractFromSlice,
}: {
	model: Spectrum1DCanvasFitModel;
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
	editingParameter: FitEditingParameter | null;
	draftValue: string;
	onDraftValueChange: (value: string) => void;
	onStartEditingParameter: (
		model: Spectrum1DCanvasFitModel,
		key: FitModelParameterKey,
		value: string,
	) => void;
	onStopEditingParameter: () => void;
	onUpdateModel: (
		modelId: number,
		patch: Spectrum1DCanvasFitModelPatch,
	) => void;
	onCommitModelEdit: (modelId: number) => void;
	onRenameModel: (modelId: number, label: string) => void;
	onSetModelColor: (modelId: number, color: string) => void;
	onDeleteModel: (modelId: number) => void;
	onToggleModelActive: (modelId: number) => void;
	onToggleModelSubtractFromSlice: (modelId: number) => void;
}) {
	const commitParameter = () => {
		if (editingParameter === null) {
			return;
		}

		const value = Number.parseFloat(draftValue);
		if (!Number.isFinite(value)) {
			return;
		}

		const patch = buildPatch({
			model,
			parameterKey: editingParameter.key,
			value,
			display,
		});

		if (patch === null) {
			return;
		}

		onUpdateModel(model.id, patch);
		onCommitModelEdit(model.id);
		onStopEditingParameter();
	};
	const modeValue = model.subtractFromSlice ? "subtract" : "draw";

	return (
		<Stack
			gap={2}
			px={3}
			py={3}
			borderWidth="1px"
			borderColor={model.active ? "border.muted" : "border.subtle"}
			borderRadius="md"
			bg={model.active ? "bg" : "bg.subtle"}
		>
			<HStack gap={2} align="center">
				<Box
					w="0.6rem"
					h="0.6rem"
					borderRadius="full"
					bg={model.color}
					flex="0 0 auto"
				/>
				<Input
					size="xs"
					value={model.label}
					fontWeight="semibold"
					onChange={(event) =>
						onRenameModel(model.id, event.currentTarget.value)
					}
				/>
				<Input
					aria-label={`${model.label} color`}
					type="color"
					size="xs"
					value={model.color}
					w="2rem"
					minW="2rem"
					p={0}
					onChange={(event) =>
						onSetModelColor(model.id, event.currentTarget.value)
					}
				/>
				<Tooltip content="Delete model">
					<IconButton
						aria-label={`Delete ${model.label}`}
						size="xs"
						variant="ghost"
						colorPalette="red"
						onClick={() => {
							onStopEditingParameter();
							onDeleteModel(model.id);
						}}
					>
						<Trash2 size={14} />
					</IconButton>
				</Tooltip>
			</HStack>

			<HStack gap={3} justify="space-between">
				<HStack gap={2}>
					<Switch.Root
						size="sm"
						checked={model.active}
						onCheckedChange={() => onToggleModelActive(model.id)}
					>
						<Switch.HiddenInput />
						<Switch.Control>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
					<Text fontSize="2xs" color="fg.muted">
						active
					</Text>
				</HStack>

				<SegmentGroup.Root
					size="xs"
					value={modeValue}
					disabled={!model.active}
					onValueChange={({ value }) => {
						if (
							(value === "draw" && model.subtractFromSlice) ||
							(value === "subtract" && !model.subtractFromSlice)
						) {
							onToggleModelSubtractFromSlice(model.id);
						}
					}}
				>
					<SegmentGroup.Indicator />
					<SegmentGroup.Item value="draw">
						<SegmentGroup.ItemText>Draw</SegmentGroup.ItemText>
						<SegmentGroup.ItemHiddenInput />
					</SegmentGroup.Item>
					<SegmentGroup.Item value="subtract">
						<SegmentGroup.ItemText>Subtract</SegmentGroup.ItemText>
						<SegmentGroup.ItemHiddenInput />
					</SegmentGroup.Item>
				</SegmentGroup.Root>
			</HStack>

			<Box fontSize="xs" color="fg">
				<Latex>{getFormula(model)}</Latex>
			</Box>

			{model.kind === "gaussian" ? (
				<GaussianParameterDisplay
					model={model}
					display={display}
					onStartEdit={(key, value) =>
						onStartEditingParameter(model, key, value)
					}
				/>
			) : (
				<LinearParameterDisplay
					model={model}
					display={display}
					onStartEdit={(key, value) =>
						onStartEditingParameter(model, key, value)
					}
				/>
			)}

			{editingParameter ? (
				<FitParameterEditorRow
					parameterKey={editingParameter.key}
					value={draftValue}
					unitLabel={getUnitLabel(editingParameter.key, display)}
					onValueChange={onDraftValueChange}
					onCommit={commitParameter}
					onCancel={onStopEditingParameter}
				/>
			) : null}
		</Stack>
	);
}
