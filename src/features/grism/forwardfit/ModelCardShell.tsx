"use client";

import {
	Box,
	HStack,
	IconButton,
	Input,
	Stack,
	Switch,
} from "@chakra-ui/react";
import { useId } from "react";
import { LuTrash2 } from "react-icons/lu";

import { TabbedColorPicker } from "@/components/ui/color-chooser";
import {
	StepConfigPopover,
	type StepControlItem,
} from "@/components/ui/step-config-popover";
import { Tooltip } from "@/components/ui/tooltip";

// --- Theme Constants ---
const THEME_STYLES = {
	container: (active: boolean, color: string) => ({
		position: "relative" as const,
		gap: 2,
		p: 3,
		borderRadius: "lg",
		borderWidth: "1px",
		// 玻璃拟态背景
		bg: active ? "whiteAlpha.50" : "transparent",
		backdropFilter: active ? "blur(12px)" : "none",
		// 边框逻辑：激活时亮边，未激活时暗边
		borderColor: active ? "whiteAlpha.300" : "whiteAlpha.100",
		// 左侧“能量条”指示器
		borderLeftWidth: active ? "3px" : "1px",
		borderLeftColor: active ? color : "whiteAlpha.100",
		// 阴影与光晕
		boxShadow: active ? "lg" : "none",
		// 整体透明度
		opacity: active ? 1 : 0.6,
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		_hover: {
			opacity: 1,
			borderColor: active ? "cyan.400" : "whiteAlpha.300",
			transform: "translateY(-2px)", // 悬浮感
			boxShadow: active ? "xl" : "none",
		},
	}),
	nameInput: {
		size: "xs" as const,
		fontWeight: "bold",
		fontFamily: "mono",
		variant: "subtle" as const,
		bg: "transparent",
		color: "fg",
		_focus: {
			bg: "blackAlpha.300",
			borderColor: "cyan.500",
			boxShadow: "none",
		},
		_placeholder: { color: "fg.subtle" },
	},
    formulaBox: {
        textStyle: "xs",
        fontFamily: "mono",
        
        // 文字颜色：白天用深青色，晚上用荧光青
        color: { base: "cyan.700", _dark: "cyan.300" },
        
        // 背景颜色：白天用极浅青色，晚上用半透明黑
        bg: { base: "cyan.50", _dark: "blackAlpha.400" },
        
        px: 2,
        py: 1,
        borderRadius: "md",
        borderWidth: "1px",
        
        // 边框颜色：白天用淡青色边框，晚上用微弱白光
        borderColor: { base: "cyan.200", _dark: "whiteAlpha.100" },
        
        display: "inline-block",
        alignSelf: "start",
        
        // 在白天模式下稍微加粗一点点，提升可读性
        fontWeight: { base: "medium", _dark: "normal" }
    },
	iconButton: {
		size: "xs" as const,
		variant: "ghost" as const,
		color: "whiteAlpha.500",
		_hover: { color: "red.400", bg: "whiteAlpha.100" },
	},
};

interface ModelCardShellProps {
	name: string;
	onRename: (name: string) => void;
	color: string;
	onColorChange: (color: string) => void;
	active: boolean;
	onToggleActive: (active: boolean) => void;
	onRemove: () => void;
	stepControls: StepControlItem[];
	formula: React.ReactNode;
	children: React.ReactNode;
}

export default function ModelCardShell(props: ModelCardShellProps) {
	const {
		name,
		onRename,
		color,
		onColorChange,
		active,
		onToggleActive,
		onRemove,
		stepControls,
		formula,
		children,
	} = props;

	const activeSwitchId = useId();
	const tooltipLabel = active ? "Deactivate model" : "Activate model";

	return (
		<Stack {...THEME_STYLES.container(active, color)}>
			{/* Header Row */}
			<HStack justify="space-between" align="center">
				<Input
					{...THEME_STYLES.nameInput}
					maxW="140px"
					value={name}
					onChange={(e) => onRename(e.target.value)}
					placeholder="MODEL_ID"
				/>

				<HStack gap={1} align="center">
					<TabbedColorPicker value={color} onValueChange={onColorChange} />

					<Tooltip ids={{ trigger: activeSwitchId }} content={tooltipLabel}>
						<Switch.Root
							size="sm"
							colorPalette="cyan" // 统一使用青色作为激活色
							ids={{ root: activeSwitchId }}
							checked={active}
							onCheckedChange={(details) => onToggleActive(details.checked)}
						>
							<Switch.HiddenInput />
							<Switch.Control
								bg="blackAlpha.400"
								borderColor="whiteAlpha.300"
								transition="all 0.2s"
								_checked={{ bg: "cyan.600", borderColor: "cyan.400" }}
							/>
							<Switch.Label srOnly>Active</Switch.Label>
						</Switch.Root>
					</Tooltip>

					<Box>
						<StepConfigPopover controls={stepControls} disabled={!active} />
					</Box>

					<IconButton
						{...THEME_STYLES.iconButton}
						aria-label="Delete model"
						onClick={onRemove}
					>
						<LuTrash2 />
					</IconButton>
				</HStack>
			</HStack>

			{/* Formula Display - "Code Snippet" Style */}
			<Box {...THEME_STYLES.formulaBox}>
				{formula}
			</Box>

			{/* Parameters Body */}
			<Stack
				gap={2}
				pt={1}
				opacity={active ? 1 : 0.8}
				pointerEvents={active ? "auto" : "none"}
				transition="opacity 0.2s"
			>
				{children}
			</Stack>
		</Stack>
	);
}