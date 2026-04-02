import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Stack } from "@chakra-ui/react";

interface DockShellProps {
	rootCss: SystemStyleObject;
	shellCss: SystemStyleObject;
	children: React.ReactNode;
}

export function DockShell({ rootCss, shellCss, children }: DockShellProps) {
	return (
		<Box css={rootCss}>
			<Stack css={shellCss} gap={0}>
				{children}
			</Stack>
		</Box>
	);
}
