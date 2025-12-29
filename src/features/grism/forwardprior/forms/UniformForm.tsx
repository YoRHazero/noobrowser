"use client";

import { Stack } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import type { UniformPrior } from "@/stores/stores-types";

interface UniformFormProps {
	config: UniformPrior;
	onChange: (config: UniformPrior) => void;
}

export default function UniformForm({ config, onChange }: UniformFormProps) {
	return (
		<Stack gap={4}>
			<CompactNumberInput
				label="Lower Bound"
				value={config.lower}
				onChange={(v) => onChange({ ...config, lower: v })}
				decimalScale={4}
			/>
			<CompactNumberInput
				label="Upper Bound"
				value={config.upper}
				onChange={(v) => onChange({ ...config, upper: v })}
				decimalScale={4}
			/>
		</Stack>
	);
}