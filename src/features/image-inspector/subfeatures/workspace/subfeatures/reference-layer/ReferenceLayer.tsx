"use client";

import {
	Box,
	createListCollection,
	IconButton,
	Portal,
	Select,
	Slider,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { IMAGE_INSPECTOR_REFERENCE_CHANNEL_OPTIONS } from "../../../../shared/constants";
import { referenceLayerRecipe } from "./ReferenceLayer.recipe";
import { useReferenceLayer } from "./useReferenceLayer";

export function ReferenceLayer() {
	const recipe = useSlotRecipe({ recipe: referenceLayerRecipe });
	const styles = recipe();
	const referenceLayer = useReferenceLayer();
	const filterCollection = useMemo(
		() =>
			createListCollection({
				items: referenceLayer.filterOptions.map((filter) => ({
					label: filter,
					value: filter,
				})),
			}),
		[referenceLayer.filterOptions],
	);
	const buttonDisabled = referenceLayer.downloadDisabledReason !== null;

	return (
		<Stack css={styles.root}>
			<Stack css={styles.section}>
				<Box css={styles.sectionHeader}>
					<Text css={styles.sectionTitle}>Counterpart Image</Text>
					<Tooltip
						content={
							referenceLayer.downloadDisabledReason ?? "Fetch counterpart image"
						}
						showArrow
					>
						<Box css={styles.fetchButtonTrigger}>
							<IconButton
								aria-label="Fetch counterpart image"
								size="sm"
								colorPalette="cyan"
								css={styles.fetchButton}
								disabled={buttonDisabled}
								loading={referenceLayer.isFetchingImage}
								onClick={referenceLayer.onDownloadCounterpartImage}
							>
								<Download />
							</IconButton>
						</Box>
					</Tooltip>
				</Box>

				<Text css={styles.secondaryTitle}>False Image Setup</Text>
				<Box css={styles.filterGrid}>
					{IMAGE_INSPECTOR_REFERENCE_CHANNEL_OPTIONS.map((channel) => {
						const isActive =
							referenceLayer.mode === "rgb" ||
							referenceLayer.mode === channel.value;

						return (
							<Box
								key={channel.value}
								role="button"
								tabIndex={0}
								data-active={isActive ? "true" : undefined}
								data-channel={channel.value}
								css={styles.filterCard}
								onClick={() => referenceLayer.onModeCardClick(channel.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										referenceLayer.onModeCardClick(channel.value);
									}
								}}
							>
								<Box css={styles.filterHeader} data-part="filter-header">
									<Text css={styles.filterLabel} color={channel.color}>
										{channel.label}
									</Text>
								</Box>
								<Box
									css={styles.filterSelectShell}
									onClick={(event) => event.stopPropagation()}
								>
									<Select.Root
										collection={filterCollection}
										size="xs"
										value={
											referenceLayer.filterRgb[channel.value]
												? [referenceLayer.filterRgb[channel.value]]
												: []
										}
										onValueChange={({ value }) => {
											const nextValue = value[0];
											if (nextValue) {
												referenceLayer.onFilterChange(channel.value, nextValue);
											}
										}}
									>
										<Select.HiddenSelect />
										<Select.Control css={styles.selectControl}>
											<Select.Trigger>
												<Select.ValueText
													placeholder={
														referenceLayer.isLoadingFilters
															? "Loading"
															: "Filter"
													}
												/>
												<Select.Indicator />
											</Select.Trigger>
										</Select.Control>
										<Portal>
											<Select.Positioner>
												<Select.Content css={styles.selectContent}>
													{filterCollection.items.map((item) => (
														<Select.Item
															key={item.value}
															item={item}
															css={styles.selectItem}
														>
															<Select.ItemText>{item.label}</Select.ItemText>
															<Select.ItemIndicator />
														</Select.Item>
													))}
												</Select.Content>
											</Select.Positioner>
										</Portal>
									</Select.Root>
								</Box>
							</Box>
						);
					})}
				</Box>
				{referenceLayer.filterErrorMessage ? (
					<Text css={styles.error}>{referenceLayer.filterErrorMessage}</Text>
				) : null}

				<Box css={styles.opacityRow}>
					<Text css={styles.label}>opacity</Text>
					<Slider.Root
						aria-label={["Reference layer opacity"]}
						colorPalette="cyan"
						size="sm"
						min={0}
						max={1}
						step={0.05}
						value={[referenceLayer.opacity]}
						css={styles.opacitySlider}
						onValueChange={({ value }) => {
							const nextValue = value[0];
							if (typeof nextValue === "number") {
								referenceLayer.onOpacityChange(nextValue);
							}
						}}
					>
						<Slider.Control>
							<Slider.Track css={styles.opacityTrack}>
								<Slider.Range css={styles.opacityRange} />
							</Slider.Track>
							<Slider.Thumbs />
						</Slider.Control>
					</Slider.Root>
					<Text css={styles.opacityValue}>
						{Math.round(referenceLayer.opacity * 100)}%
					</Text>
				</Box>
			</Stack>
		</Stack>
	);
}
