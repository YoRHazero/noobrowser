import { HStack, NumberInput, Text } from "@chakra-ui/react";

// --- Theme Constants ---
const THEME_STYLES = {
	label: {
		textStyle: "2xs",
		color: "fg.muted",
		fontWeight: "bold", //稍微加粗一点增强可读性
		textTransform: "uppercase" as const,
		letterSpacing: "0.05em",
		opacity: 0.8,
	},
	inputRoot: {
		size: "xs" as const,
		variant: "outline" as const,
	},
	inputField: {
		fontFamily: "mono",
		fontSize: "xs",
		borderRadius: "sm",
		transition: "all 0.2s ease-out",

		// --- 1. 常规状态颜色 ---
		// 背景：白天纯白/微灰，晚上半透明黑
		bg: { base: "white", _dark: "blackAlpha.200" },
		// 边框：白天灰色边框，晚上微弱白光
		borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
		// 文字：白天深灰，晚上浅灰
		color: { base: "gray.800", _dark: "fg.subtle" },

		// --- 2. 聚焦状态 (Focus) ---
		_focus: {
			borderColor: "cyan.500",
			boxShadow: "0 0 0 1px var(--chakra-colors-cyan-500)",
			
			// 聚焦背景：白天极淡青色，晚上加深背景
			bg: { base: "cyan.50", _dark: "blackAlpha.400" },
			
			// 聚焦文字：关键修改！白天用深青色，晚上用亮青色
			color: { base: "cyan.900", _dark: "cyan.100" },
		},

		// --- 3. 悬停状态 (Hover) ---
		_hover: {
			// 悬停边框：白天加深灰色，晚上加亮白色
			borderColor: { base: "gray.300", _dark: "whiteAlpha.300" },
		},

		_disabled: {
			opacity: 0.4,
			cursor: "not-allowed",
			bg: { base: "gray.100", _dark: "whiteAlpha.50" }, // 禁用时给个灰色背景
		},
	},
};

interface CompactNumberInputProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	step?: number;
	min?: number;
	max?: number;
	decimalScale?: number;
	labelWidth?: string;
	inputWidth?: string;
	onBlur?: () => void;
	disabled?: boolean;
}

export function CompactNumberInput(props: CompactNumberInputProps) {
	const {
		label,
		value,
		onChange,
		step = 1,
		min,
		max,
		decimalScale = 4,
		labelWidth = "36px",
		inputWidth = "120px",
		onBlur,
		disabled,
	} = props;

	const displayValue = Number.isFinite(value)
		? value.toFixed(decimalScale).replace(/\.?0+$/, "")
		: "";

	return (
		<HStack gap={3} align="center">
			<Text {...THEME_STYLES.label} minW={labelWidth}>
				{label}
			</Text>
			
			<NumberInput.Root
				{...THEME_STYLES.inputRoot}
				maxW={inputWidth}
				value={displayValue}
				step={step}
				min={min}
				max={max}
				disabled={disabled}
				onValueChange={({ valueAsNumber }) => {
					if (!Number.isNaN(valueAsNumber)) {
						onChange(valueAsNumber);
					}
				}}
			>
				<NumberInput.Control />
				<NumberInput.Input 
					onBlur={onBlur} 
					{...THEME_STYLES.inputField}
				/>
			</NumberInput.Root>
		</HStack>
	);
}