"use client";

import { HStack, Stack, Text } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import type {
	FitModel,
	NormalPrior,
	TruncatedNormalPrior,
} from "@/stores/stores-types";

interface GaussianFamilyFormProps {
	config: NormalPrior | TruncatedNormalPrior;
	onChange: (config: NormalPrior | TruncatedNormalPrior) => void;
	model: FitModel;
	paramName: string;
}

export default function GaussianFamilyForm(props: GaussianFamilyFormProps) {
	const { config, onChange } = props;

	return (
		<Stack gap={4}>
			{/* Prior Mean: 参数的期望值 */}
			<CompactNumberInput
				label="μ"
				value={config.mu}
				onChange={(v) => onChange({ ...config, mu: v })}
				decimalScale={4}
			/>

			{/* Prior Sigma: 参数分布的宽度（不确定度） */}
			<CompactNumberInput
				label="σ"
				value={config.sigma}
				onChange={(v) => onChange({ ...config, sigma: v })}
				min={0} // 标准差必须为正
				decimalScale={4}
			/>

			{/* Truncated 边界设置 (仅当类型为 TruncatedNormal 时显示) */}
			{config.type === "TruncatedNormal" && (
				<Stack gap={1}>
					<Text fontSize="xs" fontWeight="semibold" color="fg.muted">
						Truncation Bounds
					</Text>
					<HStack gap={2}>
						<CompactNumberInput
							label="Lower"
							value={config.lower ?? -Infinity}
							onChange={(v) =>
								onChange({
									...config,
									lower: v,
								})
							}
							labelWidth="40px"
						/>
						<CompactNumberInput
							label="Upper"
							value={config.upper ?? Infinity}
							onChange={(v) =>
								onChange({
									...config,
									upper: v,
								})
							}
							labelWidth="40px"
						/>
					</HStack>
				</Stack>
			)}
		</Stack>
	);
}
