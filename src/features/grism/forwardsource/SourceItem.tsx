import {
	Box,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
	type IconButtonProps,
} from "@chakra-ui/react";
import {
	Cpu,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { TraceSource } from "@/stores/stores-types";
import { useFitStore } from "@/stores/fit";

// --- Theme Constants ---
const THEME_STYLES = {
	container: (selected: boolean) => ({
		p: 2,
		borderRadius: "md",
		borderWidth: "1px",
		transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		cursor: "pointer",

		bg: selected
			? { base: "cyan.50", _dark: "whiteAlpha.100" }
			: { base: "white", _dark: "transparent" },

		borderColor: selected
			? { base: "cyan.500", _dark: "cyan.500" }
			: { base: "gray.200", _dark: "whiteAlpha.100" },

		backdropFilter: selected ? { _dark: "blur(8px)" } : "none",

		_hover: {
			borderColor: selected ? "cyan.400" : "cyan.300",
			bg: selected
				? { base: "cyan.100", _dark: "whiteAlpha.200" }
				: { base: "gray.50", _dark: "whiteAlpha.50" },
		},
	}),
	idText: {
		fontSize: "xs" as const,
		fontWeight: "bold" as const,
		fontFamily: "mono",
	},
	coordText: {
		fontSize: "2xs" as const,
		color: "fg.subtle",
		fontFamily: "mono",
		mt: 0.5,
	},
	runButton: (canRun: boolean, isRunning: boolean) => ({
		size: "xs" as const,
		h: "24px",
		w: "24px",
		minW: "24px",
		variant: (canRun && !isRunning ? "surface" : "ghost") as IconButtonProps["variant"],
		colorPalette: canRun && !isRunning ? "cyan" : "gray",
		disabled: !canRun || isRunning,
        isLoading: isRunning,
		_hover:
			canRun && !isRunning
				? {
						transform: "scale(1.1)",
						bg: "cyan.500",
						color: "white",
						boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)",
					}
				: undefined,

		transition: "all 0.2s",
	}),
};

interface SourceItemProps {
	source: TraceSource;
	isSelected: boolean;
	canRun: boolean;
	onSelect: () => void;
	onRun: () => void;
}

export default function SourceItem({
	source,
	isSelected,
	canRun,
	onSelect,
	onRun,
}: SourceItemProps) {
	const jobs = useFitStore((state) => state.jobs);
	const activeJob = jobs.find(
		(j) =>
			j.job_id === source.id &&
			(j.status === "pending" || j.status === "processing"),
	);
    const isRunning = !!activeJob;

	return (
		<Flex
			{...THEME_STYLES.container(isSelected)}
			justify="space-between"
			align="center"
			onClick={onSelect}
		>
			{/* Left: Info */}
			<HStack gap={3}>
				<Box
					w="8px"
					h="8px"
					borderRadius="full"
					bg={source.color}
					boxShadow={`0 0 6px ${source.color}`}
					opacity={0.8}
				/>

				<Stack gap={0}>
					<HStack align="center" gap={2}>
						<Text
							{...THEME_STYLES.idText}
							color={
								isSelected ? { base: "cyan.700", _dark: "cyan.300" } : "fg"
							}
						>
							{source.id.slice(0, 6).toUpperCase()}
						</Text>
					</HStack>
					<Text {...THEME_STYLES.coordText}>
						X:{source.x.toFixed(1)} Y:{source.y.toFixed(1)}
					</Text>
				</Stack>
			</HStack>

			{/* Right: Actions */}
			<HStack onClick={(e) => e.stopPropagation()} gap={1}>
				{/* --- MCMC Run Button --- */}
				<Tooltip
					content={
						activeJob
							? `Job Running (${activeJob.status})`
							: canRun
								? "Run MCMC Analysis"
								: "Select a Config first"
					}
					disabled={false}
				>
					<IconButton
						aria-label="Run MCMC Fit"
						{...THEME_STYLES.runButton(canRun, isRunning)}
						onClick={onRun}
					>
						<Cpu size={14} />
					</IconButton>
				</Tooltip>
			</HStack>
		</Flex>
	);
}


