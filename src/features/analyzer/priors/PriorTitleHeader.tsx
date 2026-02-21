import { Input } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useAnalyzerStore } from "@/stores/analyzer";

interface FitConfigurationTitleEditorProps {
	configId: string;
}

export default function FitConfigurationTitleEditor({
	configId,
}: FitConfigurationTitleEditorProps) {
	const configName = useAnalyzerStore(
		useShallow(
			(s) => s.configurations.find((c) => c.id === configId)?.name || "",
		),
	);
	const setConfigurationName = useAnalyzerStore((s) => s.setConfigurationName);

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
