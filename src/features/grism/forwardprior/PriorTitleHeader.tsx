import { Input } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";

interface FitConfigurationTitleEditorProps {
	configId: string;
}

export default function FitConfigurationTitleEditor({
	configId,
}: FitConfigurationTitleEditorProps) {
	const configName = useFitStore(
		useShallow(
			(s) => s.configurations.find((c) => c.id === configId)?.name || "",
		),
	);
	const setConfigurationName = useFitStore((s) => s.setConfigurationName);

	return (
		<Input
			variant="flushed"
			size="sm"
			fontWeight="bold"
			fontSize="md"
			placeholder="Untitled Configuration"
			value={configName}
			onChange={(e) => setConfigurationName(configId, e.target.value)}
			_focus={{ borderColor: "cyan.400" }}
			maxLength={30}
		/>
	);
}
