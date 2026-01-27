import {
	Box,
	Checkbox,
	Flex,
	HStack,
	Image,
	Input,
	NativeSelect,
	Spinner,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFitPlot, type CatalogItemResponse } from "@/hooks/query/fit";
import type { PlotConfiguration } from "@/hooks/query/fit/schemas";
import { Field } from "@/components/ui/field";

interface FitPlotViewerProps {
	item: CatalogItemResponse;
}

export function FitPlotViewer({ item }: FitPlotViewerProps) {
	// Get model names from the catalog item's plot_url_dict
	const modelNames = item.plot_url_dict ? Object.keys(item.plot_url_dict) : [];
	const defaultModel = item.best_model_name ?? modelNames[0] ?? "";

	const [selectedModel, setSelectedModel] = useState<string>(defaultModel);
	const [config, setConfig] = useState<PlotConfiguration>({
		show_subtracted_models: true,
		show_posterior_predictive: true,
		show_individual_models: true,
		x_min: null,
		x_max: null,
		y_min: null,
		y_max: null,
		theme: "light",
	});

	// Update selected model if the item changes
	useEffect(() => {
		const newDefault = item.best_model_name ?? (item.plot_url_dict ? Object.keys(item.plot_url_dict)[0] : "") ?? "";
		setSelectedModel(newDefault);
	}, [item.id, item.best_model_name, item.plot_url_dict]);

	const { data: plotBlob, isFetching: isFetchingPlot } = useFitPlot({
		source_id: item.id,
		model_name: selectedModel,
		config: config,
		enabled: !!selectedModel && modelNames.length > 0,
	});

	const [plotUrl, setPlotUrl] = useState<string | null>(null);

	useEffect(() => {
		if (plotBlob) {
			const url = URL.createObjectURL(plotBlob);
			setPlotUrl(url);
			return () => URL.revokeObjectURL(url);
		} else {
			setPlotUrl(null);
		}
	}, [plotBlob]);

	if (modelNames.length === 0) {
		return <Text>No fit results available for this source.</Text>;
	}

	const handleConfigChange = (field: keyof PlotConfiguration, value: any) => {
		setConfig((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Flex
			direction={{ base: "column", lg: "row" }}
			gap={6}
			w="full"
			h="full"
			align="flex-start"
		>
			<VStack
				w={{ base: "full", lg: "300px" }}
				gap={4}
				p={4}
				borderWidth="1px"
				borderRadius="md"
				align="stretch"
				flexShrink={0}
			>
				<Field label="Model">
					<NativeSelect.Root>
						<NativeSelect.Field
							value={selectedModel}
							onChange={(e) => setSelectedModel(e.target.value)}
						>
							{modelNames.map((name) => (
								<option key={name} value={name}>
									{name} {name === item.best_model_name ? "(Best)" : ""}
								</option>
							))}
						</NativeSelect.Field>
						<NativeSelect.Indicator />
					</NativeSelect.Root>
				</Field>

				<Stack gap={2}>
					<Checkbox.Root
						checked={config.show_subtracted_models}
						onCheckedChange={(e) =>
							handleConfigChange("show_subtracted_models", !!e.checked)
						}
					>
						<Checkbox.HiddenInput />
						<Checkbox.Control>
							<Checkbox.Indicator />
						</Checkbox.Control>
						<Checkbox.Label>Show Subtracted</Checkbox.Label>
					</Checkbox.Root>
					<Checkbox.Root
						checked={config.show_individual_models}
						onCheckedChange={(e) =>
							handleConfigChange("show_individual_models", !!e.checked)
						}
					>
						<Checkbox.HiddenInput />
						<Checkbox.Control>
							<Checkbox.Indicator />
						</Checkbox.Control>
						<Checkbox.Label>Show Individual</Checkbox.Label>
					</Checkbox.Root>
					<Checkbox.Root
						checked={config.show_posterior_predictive}
						onCheckedChange={(e) =>
							handleConfigChange("show_posterior_predictive", !!e.checked)
						}
					>
						<Checkbox.HiddenInput />
						<Checkbox.Control>
							<Checkbox.Indicator />
						</Checkbox.Control>
						<Checkbox.Label>Show Posterior</Checkbox.Label>
					</Checkbox.Root>
				</Stack>
				<Field label="Theme">
					<NativeSelect.Root>
						<NativeSelect.Field
							value={config.theme}
							onChange={(e) =>
								handleConfigChange("theme", e.target.value as "light" | "dark")
							}
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</NativeSelect.Field>
						<NativeSelect.Indicator />
					</NativeSelect.Root>
				</Field>

				<Stack gap={2}>
					<Text fontWeight="bold" fontSize="sm">
						Limits (X)
					</Text>
					<HStack>
						<Input
							placeholder="Min"
							type="number"
							value={config.x_min ?? ""}
							onChange={(e) =>
								handleConfigChange(
									"x_min",
									e.target.value ? Number(e.target.value) : null,
								)
							}
						/>
						<Input
							placeholder="Max"
							type="number"
							value={config.x_max ?? ""}
							onChange={(e) =>
								handleConfigChange(
									"x_max",
									e.target.value ? Number(e.target.value) : null,
								)
							}
						/>
					</HStack>
				</Stack>
				<Stack gap={2}>
					<Text fontWeight="bold" fontSize="sm">
						Limits (Y)
					</Text>
					<HStack>
						<Input
							placeholder="Min"
							type="number"
							value={config.y_min ?? ""}
							onChange={(e) =>
								handleConfigChange(
									"y_min",
									e.target.value ? Number(e.target.value) : null,
								)
							}
						/>
						<Input
							placeholder="Max"
							type="number"
							value={config.y_max ?? ""}
							onChange={(e) =>
								handleConfigChange(
									"y_max",
									e.target.value ? Number(e.target.value) : null,
								)
							}
						/>
					</HStack>
				</Stack>
			</VStack>

			<Box flex={1} w="full" position="relative" minH="500px">
				{isFetchingPlot && (
					<Box
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						bg="rgba(255, 255, 255, 0.7)"
						zIndex={1}
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						<Spinner size="xl" />
					</Box>
				)}
				{plotUrl ? (
					<Image
						src={plotUrl}
						alt="Fit Plot"
						objectFit="contain"
						w="full"
						h="auto"
						maxH="800px"
					/>
				) : (
					<Flex h="full" align="center" justify="center" bg="gray.50">
						<Text color="gray.500">Select options to generate plot</Text>
					</Flex>
				)}
			</Box>
		</Flex>
	);
}
