import { Box, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";
import type { FitModelListModel } from "../useSpectrumWorkspaceLineFit";
import { FitModelCard } from "./FitModelCard";
import type { FitModelParameterKey } from "./FitParameterEditorRow";

export interface FitEditingParameter {
	modelId: number;
	key: FitModelParameterKey;
}

export interface FitModelListProps extends FitModelListModel {
	hasSelectedConfiguration: boolean;
}

export function FitModelList({
	models,
	display,
	hasSelectedConfiguration,
	onUpdateModel,
	onCommitModelEdit,
	onRenameModel,
	onSetModelColor,
	onDeleteModel,
	onToggleModelActive,
	onToggleModelSubtractFromSlice,
}: FitModelListProps) {
	const [editingParameter, setEditingParameter] =
		useState<FitEditingParameter | null>(null);
	const [draftValue, setDraftValue] = useState("");

	const startEditingParameter = (
		model: Spectrum1DCanvasFitModel,
		key: FitModelParameterKey,
		value: string,
	) => {
		setEditingParameter({ modelId: model.id, key });
		setDraftValue(value);
	};
	const stopEditingParameter = () => {
		setEditingParameter(null);
		setDraftValue("");
	};

	if (!hasSelectedConfiguration) {
		return (
			<Stack h="full" minH={0} align="center" justify="center" px={4}>
				<Text fontSize="sm" color="fg.muted">
					No fit configuration selected.
				</Text>
			</Stack>
		);
	}

	if (models.length === 0) {
		return (
			<Stack h="full" minH={0} align="center" justify="center" px={4}>
				<Text fontSize="sm" color="fg.muted">
					No fit models in this configuration.
				</Text>
			</Stack>
		);
	}

	return (
		<Box h="full" minH={0} overflowY="auto" px={3} py={3}>
			<Stack gap={2}>
				{models.map((model) => (
					<FitModelCard
						key={model.id}
						model={model}
						display={display}
						editingParameter={
							editingParameter?.modelId === model.id ? editingParameter : null
						}
						draftValue={draftValue}
						onDraftValueChange={setDraftValue}
						onStartEditingParameter={startEditingParameter}
						onStopEditingParameter={stopEditingParameter}
						onUpdateModel={onUpdateModel}
						onCommitModelEdit={onCommitModelEdit}
						onRenameModel={onRenameModel}
						onSetModelColor={onSetModelColor}
						onDeleteModel={onDeleteModel}
						onToggleModelActive={onToggleModelActive}
						onToggleModelSubtractFromSlice={onToggleModelSubtractFromSlice}
					/>
				))}
			</Stack>
		</Box>
	);
}
