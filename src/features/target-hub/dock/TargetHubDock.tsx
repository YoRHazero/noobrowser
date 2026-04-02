"use client";

import { Button, useSlotRecipe } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronsLeft } from "react-icons/lu";
import { targetHubMockQuickNav, targetHubMockSession } from "../mocks";
import { DOCK_EXIT_DURATION_MS, TARGET_HUB_Z_INDEX } from "../shared/constants";
import { useTargetHubStore } from "../store";
import { getDockAnimation } from "./animations/dock.animations";
import { DockQuickNav } from "./components/DockQuickNav";
import { DockSessionCard } from "./components/DockSessionCard";
import { DockShell } from "./components/DockShell";
import { useDockAnchor } from "./hooks/useDockAnchor";
import { dockRecipe } from "./recipes/dock.recipe";

export default function TargetHubDock() {
	const collapseToIcon = useTargetHubStore((state) => state.collapseToIcon);
	const effect = useTargetHubStore((state) => state.effect);
	const top = useDockAnchor();
	const [isClosing, setIsClosing] = useState(false);

	const recipe = useSlotRecipe({ recipe: dockRecipe });
	const styles = recipe();

	useEffect(() => {
		setIsClosing(false);
	}, []);

	const handleCollapse = () => {
		setIsClosing(true);
		window.setTimeout(() => {
			collapseToIcon();
		}, DOCK_EXIT_DURATION_MS);
	};

	return (
		<DockShell
			rootCss={{
				...styles.root,
				top: `${top}px`,
				animation: getDockAnimation(isClosing ? "exit" : "enter"),
				pointerEvents: isClosing ? "none" : "auto",
				"--target-hub-z-index": TARGET_HUB_Z_INDEX,
			}}
			shellCss={styles.shell}
		>
			<DockSessionCard
				label={targetHubMockSession.label}
				status={targetHubMockSession.status}
				color={targetHubMockSession.color}
				effect={effect}
				cardCss={styles.sessionCard}
				dotCss={styles.sessionDot}
				statusCss={styles.status}
				feedbackCss={styles.feedbackLayer}
				noticeCss={styles.notice}
			/>
			<DockQuickNav
				items={targetHubMockQuickNav}
				listCss={styles.navList}
				itemCss={styles.navItem}
			/>
			<Button
				variant="outline"
				size="sm"
				css={styles.collapseButton}
				onClick={handleCollapse}
			>
				<LuChevronsLeft />
				Collapse
			</Button>
		</DockShell>
	);
}
