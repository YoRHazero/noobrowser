import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";

export function useFitConfigurationList() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { configurations, toggleConfigurationSelection, removeConfiguration } =
		useFitStore(
			useShallow((state) => ({
				configurations: state.configurations,
				toggleConfigurationSelection: state.toggleConfigurationSelection,
				removeConfiguration: state.removeConfiguration,
			})),
		);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [editingId, setEditingId] = useState<string | null>(null);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const openPrior = (configId: string) => setEditingId(configId);
	const closePrior = () => setEditingId(null);
	const removeConfig = (configId: string) => {
		if (editingId === configId) {
			setEditingId(null);
		}
		removeConfiguration(configId);
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		configurations,
		editingId,
		openPrior,
		closePrior,
		removeConfig,
		toggleConfigurationSelection,
	};
}
