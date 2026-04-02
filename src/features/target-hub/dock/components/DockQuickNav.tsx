import type { SystemStyleObject } from "@chakra-ui/react";
import { Button, HStack, Stack } from "@chakra-ui/react";
import { LuChartSpline, LuScanSearch, LuWaypoints } from "react-icons/lu";

const NAV_ICONS = {
	Overview: LuWaypoints,
	Analyzer: LuChartSpline,
	Inspector: LuScanSearch,
} as const;

interface DockQuickNavProps {
	items: readonly string[];
	listCss: SystemStyleObject;
	itemCss: SystemStyleObject;
}

export function DockQuickNav({ items, listCss, itemCss }: DockQuickNavProps) {
	return (
		<Stack css={listCss}>
			{items.map((item) => {
				const Icon = NAV_ICONS[item as keyof typeof NAV_ICONS];
				return (
					<Button
						key={item}
						variant="ghost"
						size="sm"
						css={itemCss}
						tabIndex={-1}
						aria-disabled
					>
						<HStack justify="flex-start" w="full" gap={2}>
							<Icon size={14} />
							<span>{item}</span>
						</HStack>
					</Button>
				);
			})}
		</Stack>
	);
}
