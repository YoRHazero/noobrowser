import {
	Badge,
	Box,
	Heading,
	Image,
	Stack,
	Tabs,
	Text,
} from "@chakra-ui/react";
import type { CatalogItemResponse } from "@/hook/connection-hook";
import { useConnectionStore } from "@/stores/connection";

interface CatalogDetailProps {
	item: CatalogItemResponse;
}
function pad2(n: number) {
	return String(n).padStart(2, "0");
}
export function ra2hms(raDeg: number) {
	// wrap to [0, 360)
	const ra = ((raDeg % 360) + 360) % 360;

	const totalHours = ra / 15;
	const h = Math.floor(totalHours);

	const totalMinutes = (totalHours - h) * 60;
	const m = Math.floor(totalMinutes);

	const s = (totalMinutes - m) * 60;

	return `${pad2(h)}:${pad2(m)}:${s.toFixed(2).padStart(5, "0")}`;
}
export function dec2dms(decDeg: number) {
	const sign = decDeg < 0 ? "-" : "+";
	const abs = Math.abs(decDeg);

	const d = Math.floor(abs);
	const totalMinutes = (abs - d) * 60;
	const m = Math.floor(totalMinutes);
	const s = (totalMinutes - m) * 60;

	return `${sign}${pad2(d)}:${pad2(m)}:${s.toFixed(2).padStart(5, "0")}`;
}

export function CatalogDetail({ item }: CatalogDetailProps) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const grizliCutoutUrl = `https://grizli-cutout.herokuapp.com/thumb?ra=${item.ra}&dec=${item.dec}&size=2&output=png&filters=f182m-clear,f210m-clear,f444w-clear`;
	return (
		<Stack gap={4} p={4}>
			<Box>
				<Heading size="lg">{item.id}</Heading>
				<Stack direction="row" gap={4} mt={2}>
					<Badge variant="surface">z={item.z?.toFixed(4) ?? "N/A"}</Badge>
					<Text fontSize="sm" color="fg.muted">
						RA: {item.ra.toFixed(5)}, Dec: {item.dec.toFixed(5)}
					</Text>
					<Text fontSize="sm" color="fg.muted">
						RA: {ra2hms(item.ra)}, Dec: {dec2dms(item.dec)}
					</Text>
				</Stack>
				<Text fontSize="xs" fontFamily="mono" color="fg.muted" mt={1}>
					{item.ref_basename}
				</Text>
			</Box>

			<Tabs.Root defaultValue="model_comparison" variant="enclosed">
				<Tabs.List>
					<Tabs.Trigger value="model_comparison">Model Comparison</Tabs.Trigger>
					<Tabs.Trigger value="best_model" disabled={!item.best_model_plot_url}>
						Best Model
					</Tabs.Trigger>
					<Tabs.Trigger
						value="posterior"
						disabled={!item.best_model_posterior_url}
					>
						Posterior
					</Tabs.Trigger>
					<Tabs.Trigger value="cutout">Cutout</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="model_comparison" p={4}>
					{item.model_comparison_plot_url ? (
						<Stack gap={2} align="center">
							<Image
								src={`${backendUrl}${item.model_comparison_plot_url}`}
								alt="Model Comparison"
								objectFit="contain"
								maxH="80vh"
								w="full"
							/>
							<Text
								asChild
								fontSize="sm"
								color="blue.500"
								textDecoration="underline"
							>
								<a
									href={`${backendUrl}${item.model_comparison_plot_url}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Open in new tab
								</a>
							</Text>
						</Stack>
					) : (
						<Text color="fg.muted">No model comparison plot available</Text>
					)}
				</Tabs.Content>

				<Tabs.Content value="best_model" p={4}>
					{item.best_model_plot_url ? (
						<Stack gap={2} align="center">
							<Image
								src={`${backendUrl}${item.best_model_plot_url}`}
								alt="Best Model Fit"
								objectFit="contain"
								maxH="80vh"
								w="full"
							/>
							<Text
								asChild
								fontSize="sm"
								color="blue.500"
								textDecoration="underline"
							>
								<a
									href={`${backendUrl}${item.best_model_plot_url}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Open in new tab
								</a>
							</Text>
						</Stack>
					) : (
						<Text color="fg.muted">No best model plot available</Text>
					)}
				</Tabs.Content>

				<Tabs.Content value="posterior" p={4}>
					{item.best_model_posterior_url ? (
						<Stack gap={2} align="center">
							<Image
								src={`${backendUrl}${item.best_model_posterior_url}`}
								alt="Best Model Posterior"
								objectFit="contain"
								maxH="80vh"
								w="full"
							/>
							<Text
								asChild
								fontSize="sm"
								color="blue.500"
								textDecoration="underline"
							>
								<a
									href={`${backendUrl}${item.best_model_posterior_url}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Open in new tab
								</a>
							</Text>
						</Stack>
					) : (
						<Text color="fg.muted">No posterior plot available</Text>
					)}
				</Tabs.Content>

				<Tabs.Content value="cutout" p={4}>
					<Stack gap={2} align="center">
						<Image
							src={grizliCutoutUrl}
							alt="Cutout"
							objectFit="contain"
							maxH="80vh"
							w="full"
						/>
						<Text
							asChild
							fontSize="sm"
							color="blue.500"
							textDecoration="underline"
						>
							<a
								href={grizliCutoutUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Open in new tab
							</a>
						</Text>
					</Stack>
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
}
