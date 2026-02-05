import {
	Badge,
	Box,
	Button,
	Grid,
	Heading,
	HStack,
	Image,
	NumberInput,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuExternalLink, LuSearch } from "react-icons/lu";
import { useNedSearch } from "@/hooks/query/source/useNedSearch";
import { useCatalogSelection } from "../hooks/useCatalogSelection";
import { dec2dms, ra2hms } from "../utils/coords";

function openExternal(url: string) {
	window.open(url, "_blank", "noopener,noreferrer");
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<HStack justify="space-between" align="start" gap={4}>
			<Text fontSize="xs" color="fg.muted">
				{label}
			</Text>
			<Text fontSize="sm" textAlign="right">
				{value}
			</Text>
		</HStack>
	);
}

export function CatalogSourceInfoPanel() {
	const { selectedSource } = useCatalogSelection();
	const [nedRadius, setNedRadius] = useState(2);
	const [nedOpen, setNedOpen] = useState(false);

	const {
		data: nedResults,
		isFetching: nedLoading,
		refetch: refetchNed,
	} = useNedSearch({
		ra: selectedSource?.ra,
		dec: selectedSource?.dec,
		radius: nedRadius,
		enabled: false,
	});

	if (!selectedSource) {
		return (
			<Box
				p={4}
				borderWidth="1px"
				borderColor="border.muted"
				borderRadius="lg"
				bg="bg.surface"
			>
				<Text color="fg.muted">Select a source to view details.</Text>
			</Box>
		);
	}

	const grizliCutoutUrl = `https://grizli-cutout.herokuapp.com/thumb?ra=${selectedSource.ra}&dec=${selectedSource.dec}&size=2&output=png&filters=f182m-clear,f210m-clear,f444w-clear`;
	const nedUrl = `https://ned.ipac.caltech.edu/bypos?pos=${selectedSource.ra}+${selectedSource.dec}`;

	return (
		<Box
			p={4}
			borderWidth="1px"
			borderColor="border.muted"
			borderRadius="lg"
			bg="bg.surface"
		>
			<Stack gap={3}>
				<Box>
					<Heading size="md">{selectedSource.id}</Heading>
					<HStack gap={2} mt={2} flexWrap="wrap">
						<Badge variant="surface">
							z={selectedSource.z?.toFixed(4) ?? "N/A"}
						</Badge>
						{selectedSource.user && (
							<Badge variant="outline">{selectedSource.user}</Badge>
						)}
						<Text fontSize="xs" color="fg.muted">
							{selectedSource.created_at}
						</Text>
					</HStack>
					<Text fontSize="xs" fontFamily="mono" color="fg.muted" mt={1}>
						{selectedSource.ref_basename}
					</Text>
				</Box>

				<Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap={4}>
					<Stack gap={3}>
						<Box
							p={3}
							borderWidth="1px"
							borderColor="border.muted"
							borderRadius="md"
						>
							<Stack gap={2}>
								<Heading size="xs" color="fg.muted">
									Source Metadata
								</Heading>
								<InfoRow
									label="RA (deg)"
									value={selectedSource.ra.toFixed(6)}
								/>
								<InfoRow
									label="Dec (deg)"
									value={selectedSource.dec.toFixed(6)}
								/>
								<InfoRow
									label="RA/Dec (hms/dms)"
									value={`${ra2hms(selectedSource.ra)} / ${dec2dms(selectedSource.dec)}`}
								/>
								<InfoRow
									label="Pixel"
									value={`${selectedSource.pixel_x.toFixed(2)}, ${selectedSource.pixel_y.toFixed(2)}`}
								/>
								<InfoRow
									label="Tags"
									value={
										selectedSource.tags.length > 0
											? selectedSource.tags.join(", ")
											: "None"
									}
								/>
							</Stack>
						</Box>

						<Box
							p={3}
							borderWidth="1px"
							borderColor="border.muted"
							borderRadius="md"
						>
							<Heading size="xs" color="fg.muted" mb={2}>
								NED Lookup
							</Heading>
							<Text fontSize="sm" color="fg.muted">
								Use the position to explore NED entries nearby.
							</Text>
							<Stack mt={3} gap={2}>
								<HStack justify="space-between" align="center">
									<Text fontSize="xs" color="fg.muted">
										{selectedSource.ra.toFixed(5)},{" "}
										{selectedSource.dec.toFixed(5)}
									</Text>
									<Button
										size="xs"
										variant="outline"
										onClick={() => openExternal(nedUrl)}
									>
										Open NED <LuExternalLink />
									</Button>
								</HStack>
								<HStack gap={2} align="center">
									<Text fontSize="xs" color="fg.muted">
										Radius (arcsec)
									</Text>
									<NumberInput.Root
										size="xs"
										width="90px"
										value={nedRadius.toString()}
										onValueChange={(event) => {
											const val = Number.parseFloat(event.value);
											if (!Number.isNaN(val)) {
												setNedRadius(val);
											}
										}}
										min={0.1}
										max={120}
									>
										<NumberInput.Input />
									</NumberInput.Root>
									<Button
										size="xs"
										colorPalette="blue"
										loading={nedLoading}
										onClick={() => {
											setNedOpen(true);
											refetchNed();
										}}
									>
										<LuSearch /> Search
									</Button>
								</HStack>
								{nedOpen && (
									<Box
										borderWidth="1px"
										borderColor="border.muted"
										borderRadius="md"
										p={2}
										maxH="180px"
										overflowY="auto"
										bg="bg.subtle"
									>
										{nedLoading ? (
											<Text fontSize="sm" color="fg.muted">
												Searching...
											</Text>
										) : nedResults && nedResults.length > 0 ? (
											<Stack gap={2}>
												{nedResults.map((result, index) => (
													<HStack
														key={`${result.object_name}-${index}`}
														justify="space-between"
														align="start"
													>
														<Box>
															<Text fontSize="sm" fontWeight="medium">
																{result.object_name}
															</Text>
															<Text fontSize="xs" color="fg.muted">
																z: {result.redshift?.toFixed(4) ?? "N/A"}
															</Text>
														</Box>
														<Button
															size="xs"
															variant="ghost"
															aria-label="Open NED result"
															onClick={() => openExternal(result.url)}
														>
															<LuExternalLink />
														</Button>
													</HStack>
												))}
											</Stack>
										) : (
											<Text fontSize="sm" color="fg.muted">
												No results.
											</Text>
										)}
									</Box>
								)}
							</Stack>
						</Box>
					</Stack>

					<Stack gap={3}>
						<Box
							p={3}
							borderWidth="1px"
							borderColor="border.muted"
							borderRadius="md"
						>
							<Heading size="xs" color="fg.muted" mb={2}>
								Cutout Preview
							</Heading>
							<Image
								src={grizliCutoutUrl}
								alt="Cutout"
								objectFit="contain"
								maxH="240px"
								w="full"
								borderRadius="md"
								borderWidth="1px"
								borderColor="border.muted"
							/>
							<Button
								size="xs"
								variant="ghost"
								onClick={() => openExternal(grizliCutoutUrl)}
							>
								Open image
							</Button>
						</Box>
					</Stack>
				</Grid>
			</Stack>
		</Box>
	);
}
