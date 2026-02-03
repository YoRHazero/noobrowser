import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";

export function useFitModelTransferListBox() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { models, updateModel } = useFitStore(
		useShallow((state) => ({
			models: state.models,
			updateModel: state.updateModel,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
	const [selectedRight, setSelectedRight] = useState<string[]>([]);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const leftModels = useMemo(
		() => models.filter((model) => !model.subtracted),
		[models],
	);
	const rightModels = useMemo(
		() => models.filter((model) => model.subtracted),
		[models],
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const move = (ids: string[], toSubtracted: boolean) => {
		for (const modelId of ids) {
			updateModel(Number(modelId), { subtracted: toSubtracted });
		}
		if (toSubtracted) {
			setSelectedLeft([]);
		} else {
			setSelectedRight([]);
		}
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		leftModels,
		rightModels,
		selectedLeft,
		selectedRight,
		setSelectedLeft,
		setSelectedRight,
		moveLeftToRight: () => move(selectedLeft, true),
		moveRightToLeft: () => move(selectedRight, false),
	};
}
