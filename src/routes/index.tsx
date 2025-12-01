// src/routes/index.tsx

import {
	Badge,
	Box,
	Button,
	Center,
	Field,
	Heading,
	HStack,
	Image,
	Input,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import Galaxy from "@/components/tailwind/Galaxy";
import GradientText from "@/components/tailwind/GradientText";
import ShinyText from "@/components/tailwind/ShinyText";
import { DarkMode } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import logo from "@/logo.png";
import { useConnectionStore } from "@/stores/connection";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const {
		backendUrl,
		username,
		isConnected,
		setIsConnected,
		setBackendUrl,
		setUsername,
		reset,
	} = useConnectionStore();
	const [url, setUrl] = useState(backendUrl);
	const [name, setName] = useState(username);

	const save = () => {
		let validUrl = url.trim();
		if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
			validUrl = `http://${validUrl}`;
		}
		setBackendUrl(validUrl);
		setUsername(name.trim());
		toaster.success({
			title: "Settings saved",
			description: "Configuration updated successfully.",
		});
	};

	const clear = () => {
		reset();
		setUrl("");
		setName("");
	};

	const queryStatus = useQuery({
		queryKey: ["backend-status", backendUrl],
		enabled: !!backendUrl,
		retry: 0,
		queryFn: ({ signal }) =>
			axios
				.get(backendUrl, {
					signal,
					timeout: 3000,
					validateStatus: () => true,
				})
				.then((res) => ({ status: res.status, data: res.data })),
	});

	useEffect(() => {
		if (queryStatus.isSuccess) {
			setIsConnected(true);
		} else {
			setIsConnected(false);
		}
	}, [queryStatus.isSuccess, setIsConnected]);

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

							<Box
								bg="bg.panel"
								borderWidth="1px"
								rounded="l3"
								p="6"
								shadow="sm"
							>
								<Stack gap="5">
									<Field.Root>
										<Field.Label>Backend URL</Field.Label>
										<Input
											id="backendUrl"
											placeholder="http://127.0.0.1:8000"
											value={url}
											onChange={(e) => setUrl(e.currentTarget.value)}
										/>
										<Field.HelperText>
											Example: http://localhost:8000, the address of noobackend
										</Field.HelperText>
									</Field.Root>

									<Field.Root>
										<Field.Label>Username</Field.Label>
										<Input
											id="username"
											placeholder="Your username"
											value={name}
											onChange={(e) => setName(e.currentTarget.value)}
										/>
									</Field.Root>

									<HStack justify="flex-end">
										<Button variant="outline" onClick={clear}>
											Reset
										</Button>
										<Button colorPalette="teal" onClick={save}>
											Save
										</Button>
									</HStack>
								</Stack>
							</Box>

							<Text textStyle="sm" color="fg.muted">
								Current configuration: {username || "Anonymous"}@
								{backendUrl || "Not set"}
							</Text>
							<HStack>
								<Text fontWeight="semibold">Backend status:</Text>

								{!backendUrl && <Badge variant="subtle">Not configured</Badge>}

								{backendUrl && queryStatus.isPending && (
									<HStack gap="2">
										<Spinner boxSize="4" />{" "}
										<Badge variant="subtle">Checking…</Badge>
									</HStack>
								)}

								{backendUrl && queryStatus.isError && (
									<Badge colorPalette="red">Disconnected</Badge>
								)}

								{backendUrl && queryStatus.isSuccess && (
									<Badge colorPalette="green">Connected</Badge>
								)}
							</HStack>
						</Stack>
					</Center>
				</Box>
			</div>
		</DarkMode>
	);
}
