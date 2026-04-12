"use client";

import {
	LuBriefcaseBusiness,
	LuChevronsLeft,
	LuPanelLeftOpen,
} from "react-icons/lu";
import { ActionButton } from "./parts/ActionButton";
import { ActionList } from "./parts/ActionList";
import { SessionCard } from "./parts/SessionCard";
import { Shell } from "./parts/Shell";
import { useDock } from "./useDock";

export default function Dock() {
	const {
		top,
		isAnchorDragging,
		isClosing,
		sourceCard,
		onHandlePointerDown,
		onOpenSheet,
		onOpenFitJob,
		onCollapse,
	} = useDock();

	return (
		<Shell
			top={top}
			isAnchorDragging={isAnchorDragging}
			isClosing={isClosing}
			onHandlePointerDown={onHandlePointerDown}
		>
			<SessionCard {...sourceCard} />
			<ActionList>
				<ActionButton
					label="Sheet"
					icon={<LuPanelLeftOpen size={14} />}
					tone="accent"
					onClick={onOpenSheet}
				/>
				<ActionButton
					label="Jobs"
					icon={<LuBriefcaseBusiness size={14} />}
					onClick={onOpenFitJob}
				/>
				<ActionButton
					label="Collapse"
					icon={<LuChevronsLeft size={14} />}
					onClick={onCollapse}
				/>
			</ActionList>
		</Shell>
	);
}
