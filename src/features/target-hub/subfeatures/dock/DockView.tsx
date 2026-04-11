import { Stack } from "@chakra-ui/react";
import {
	LuBriefcaseBusiness,
	LuChevronsLeft,
	LuPanelLeftOpen,
} from "react-icons/lu";
import { DockActionButton } from "./components/DockActionButton";
import { DockSessionCard } from "./components/DockSessionCard";
import { DockShell } from "./components/DockShell";

interface DockViewProps {
	top: number;
	isAnchorDragging: boolean;
	isClosing: boolean;
	sourceCard: {
		title: string;
		raText: string;
		decText: string;
		refText: string;
		color: string;
		isEmpty: boolean;
	};
	onHandlePointerDown: React.PointerEventHandler<HTMLDivElement>;
	onOpenSheet: () => void;
	onCollapse: () => void;
}

export function DockView({
	top,
	isAnchorDragging,
	isClosing,
	sourceCard,
	onHandlePointerDown,
	onOpenSheet,
	onCollapse,
}: DockViewProps) {
	return (
		<DockShell
			top={top}
			isAnchorDragging={isAnchorDragging}
			isClosing={isClosing}
			onHandlePointerDown={onHandlePointerDown}
		>
			<DockSessionCard {...sourceCard} />
			<Stack gap={1.5} mt={3}>
				<DockActionButton
					label="Sheet"
					icon={<LuPanelLeftOpen size={14} />}
					tone="accent"
					onClick={onOpenSheet}
				/>
				<DockActionButton
					label="Jobs"
					icon={<LuBriefcaseBusiness size={14} />}
					isDisabled
				/>
				<DockActionButton
					label="Collapse"
					icon={<LuChevronsLeft size={14} />}
					onClick={onCollapse}
				/>
			</Stack>
		</DockShell>
	);
}
