import { Box, HStack } from "@chakra-ui/react";
import GooeyNav from "@/components/tailwind/GooeyNav";
import { ColorModeButton } from "@/components/ui/color-mode";

const navItems = [
	{ label: "Home", to: "/" },
	{ label: "Inspector", to: "/inspector" },
	{ label: "Test", to: "/test" },
];

export default function Header() {
	return (
		<Box as="header" px="3" py="2">
			<HStack as="nav" justify="space-between" align="center">
				{/* 左侧 GooeyNav */}
				<GooeyNav items={navItems} />

				{/* 右侧 ColorMode 切换按钮 */}
				<ColorModeButton />
			</HStack>
		</Box>
	);
}
