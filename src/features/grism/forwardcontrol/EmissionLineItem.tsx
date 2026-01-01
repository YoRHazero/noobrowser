import { Box, CheckboxCard, HStack, IconButton, Spacer, Text } from "@chakra-ui/react";
import { memo } from "react";
import { LuTrash2 } from "react-icons/lu";

// --- Theme Constants ---
const THEME_STYLES = {
	cardRoot: {
		size: "sm" as const,
		w: "full",
		variant: undefined, 
	},
	// 样式生成器
	cardControl: (selected: boolean) => {
		// 定义基础颜色变量，方便在 focus/hover 中复用，保证状态一致
		const baseBg = selected 
			? { base: "cyan.50", _dark: "whiteAlpha.100" }
			: { base: "white", _dark: "transparent" };
		
		const baseBorder = selected
			? { base: "cyan.500", _dark: "cyan.500" }
			: { base: "gray.200", _dark: "whiteAlpha.100" };

		return {
			transition: "all 0.1s ease-out", // 动画加快一点，更干脆
			py: 2,
			px: 3,
			alignItems: "center",
			
			// --- 1. 基础状态 ---
			bg: baseBg,
			borderColor: baseBorder,
			// 仅在鼠标悬停时有反馈
			_hover: {
				bg: selected 
					? { base: "cyan.100", _dark: "whiteAlpha.200" } 
					: { base: "gray.50", _dark: "whiteAlpha.50" },   
				borderColor: selected 
					? { base: "cyan.600", _dark: "cyan.400" }
					: { base: "gray.300", _dark: "whiteAlpha.300" },
			},
			
			// Dark Mode 选中时的毛玻璃
			backdropFilter: selected ? { _dark: "blur(8px)" } : "none",
		};
	},

	label: {
		textStyle: "sm",
		fontWeight: "bold",
		fontFamily: "mono",
		color: { base: "cyan.500", _dark: "cyan.500" },
	},
	valueText: {
		textStyle: "xs",
		fontFamily: "mono",
		color: { base: "gray.600", _dark: "fg.subtle" },
	},
	unitText: {
		opacity: 0.6,
		fontSize: "2xs",
		ml: 1,
	},
	deleteBtn: {
		color: { base: "gray.400", _dark: "whiteAlpha.400" },
		_hover: { 
			color: "red.500", 
			bg: { base: "red.50", _dark: "whiteAlpha.100" } 
		}
	}
};

interface EmissionLineItemProps {
	name: string;
	restVal: string;
	obsVal: string;
	unit: string;
	isSelected: boolean;
	onToggle: (checked: boolean) => void;
	onRemove: () => void;
}

export const EmissionLineItem = memo(function EmissionLineItem({
	name,
	restVal,
	obsVal,
	unit,
	isSelected,
	onToggle,
	onRemove,
}: EmissionLineItemProps) {
	return (
		<Box position="relative" w="full">
			<CheckboxCard.Root
				{...THEME_STYLES.cardRoot}
				checked={isSelected}
				onCheckedChange={({ checked }) => onToggle(checked === true)}
			>
				<CheckboxCard.HiddenInput />
				<CheckboxCard.Control css={THEME_STYLES.cardControl(isSelected)}>
					<CheckboxCard.Indicator colorPalette="cyan" />

					<Box flex={1} minW={0} ml={3} pr={6}>
						<HStack align="center" gap={2} mb={0.5} w="full">
							<Text 
								{...THEME_STYLES.label} 
								color={isSelected 
									? { base: "cyan.800", _dark: "cyan.300" } 
									: THEME_STYLES.label.color
								}
							>
								{name}
							</Text>
							<Spacer />
							<Text 
								{...THEME_STYLES.valueText} 
								color={isSelected 
									? { base: "cyan.900", _dark: "white" } 
									: THEME_STYLES.valueText.color
								}
							>
								{obsVal}
								<Text as="span" {...THEME_STYLES.unitText}>{unit} (Obs)</Text>
							</Text>
						</HStack>

						<Text textStyle="xs" color="fg.muted" opacity={0.7} fontFamily="mono">
							Rest: {restVal} {unit}
						</Text>
					</Box>
				</CheckboxCard.Control>
			</CheckboxCard.Root>

			<IconButton
				aria-label="Delete line"
				size="xs"
				variant="ghost"
				{...THEME_STYLES.deleteBtn}
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				position="absolute"
				right={1}
				top="50%"
				transform="translateY(-50%)"
				zIndex={2}
			>
				<LuTrash2 />
			</IconButton>
		</Box>
	);
});