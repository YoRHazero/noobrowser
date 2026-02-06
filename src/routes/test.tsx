
import {
	Box,
	Center,
	Heading,
	Image,
	Stack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import Galaxy from "@/components/tailwind/Galaxy";
import GradientText from "@/components/tailwind/GradientText";
import ShinyText from "@/components/tailwind/ShinyText";
import { DarkMode } from "@/components/ui/color-mode";
import logo from "@/logo.png";
export const Route = createFileRoute("/test")({
	component: App,
});

function App() {

	return (
		<DarkMode>
			<div style={{ position: "relative", width: "100%", height: "100vh" }}>
				<Galaxy transparent={false} />
				<Box minH="100vh" bg="transparent" color="fg">
					<Center py="12">
						<Stack gap="8" w="full" maxW="lg" px={{ base: 4, md: 6 }}>
							<Stack align="center" gap="3">
								<Image
									src={logo}
									alt="Noobrowser logo"
									boxSize="40"
									css={{ animation: "spin 20s linear infinite" }}
								/>
								<GradientText>
									<Heading size="3xl">NooBrowser</Heading>
								</GradientText>
								<ShinyText
									text="A web tool for wfss built with React"
									disabled={false}
									speed={5}
									className="text-fg-muted"
								/>
							</Stack>
						</Stack>
					</Center>
				<Heading size="5xl" textAlign="center">
					Beyong Automated Pipeline: Recovering Lost Broad Lines
				</Heading>
				<Heading size="4xl" textAlign="center">
					——A Human-in-the-loop approach to FRESCO WFSS DATA
				</Heading>
				
				<Heading size="2xl" textAlign="center" py="8">
					Zhu Chenghao Feb 2026
				</Heading>
				</Box>
			</div>
		</DarkMode>
	)
}