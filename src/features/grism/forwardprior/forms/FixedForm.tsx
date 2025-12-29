"use client";

import { Stack } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import type { FixedPrior } from "@/stores/stores-types";

interface FixedFormProps {
	config: FixedPrior;
	onChange: (config: FixedPrior) => void;
}

export default function FixedForm({ config, onChange }: FixedFormProps) {
	return (
		<Stack gap={4}>
			<CompactNumberInput
				label="Value"
				value={config.value}
				onChange={(v) => onChange({ ...config, value: v })}
				decimalScale={4}
			/>
		</Stack>
	);
}