import {
	Box,
	Button,
	HStack,
	Input,
	ScrollArea,
	Separator,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import {
	type FormEvent,
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { useOverviewStore } from "@/stores/overview";
import {
	buildOverviewManualTarget,
	parseOverviewTargetDraft,
	validateOverviewTargetDraft,
} from "../utils/targets";
import { overviewSidebarSectionRecipe } from "./recipes/overview-sidebar-section.recipe";

interface TargetFormErrors {
	ra: string | null;
	dec: string | null;
}

export function TargetsSection() {
	const recipe = useSlotRecipe({ recipe: overviewSidebarSectionRecipe });
	const styles = recipe();
	const labelInputRef = useRef<HTMLInputElement | null>(null);
	const editingLabelInputRef = useRef<HTMLInputElement | null>(null);
	const [errors, setErrors] = useState<TargetFormErrors>({
		ra: null,
		dec: null,
	});
	const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
	const [editingLabelValue, setEditingLabelValue] = useState("");
	const [editingLabelError, setEditingLabelError] = useState<string | null>(null);
	const {
		manualTargets,
		selectedTargetIds,
		targetCoordinatePrecision,
		nextTargetSequence,
		targetDraftLabel,
		targetDraftRa,
		targetDraftDec,
		targetDraftFocusToken,
		setTargetDraftLabel,
		setTargetDraftRa,
		setTargetDraftDec,
		commitManualTarget,
		resetTargetDraft,
		toggleSelectedTarget,
		updateManualTarget,
		removeManualTarget,
	} = useOverviewStore(
		useShallow((state) => ({
			manualTargets: state.manualTargets,
			selectedTargetIds: state.selectedTargetIds,
			targetCoordinatePrecision: state.targetCoordinatePrecision,
			nextTargetSequence: state.nextTargetSequence,
			targetDraftLabel: state.targetDraftLabel,
			targetDraftRa: state.targetDraftRa,
			targetDraftDec: state.targetDraftDec,
			targetDraftFocusToken: state.targetDraftFocusToken,
			setTargetDraftLabel: state.setTargetDraftLabel,
			setTargetDraftRa: state.setTargetDraftRa,
			setTargetDraftDec: state.setTargetDraftDec,
			commitManualTarget: state.commitManualTarget,
			resetTargetDraft: state.resetTargetDraft,
			toggleSelectedTarget: state.toggleSelectedTarget,
			updateManualTarget: state.updateManualTarget,
			removeManualTarget: state.removeManualTarget,
		})),
	);
	const sortedTargets = [...manualTargets].sort(
		(left, right) =>
			Date.parse(right.createdAt || "") - Date.parse(left.createdAt || ""),
	);
	const parsedDraftCoordinate = parseOverviewTargetDraft({
		raInput: targetDraftRa,
		decInput: targetDraftDec,
	});

	useEffect(() => {
		if (targetDraftFocusToken === 0) {
			return;
		}

		const frameId = window.requestAnimationFrame(() => {
			labelInputRef.current?.focus();
			labelInputRef.current?.select();
		});

		return () => window.cancelAnimationFrame(frameId);
	}, [targetDraftFocusToken]);

	useEffect(() => {
		setErrors({
			ra: null,
			dec: null,
		});
	}, [targetDraftRa, targetDraftDec]);

	useEffect(() => {
		if (!editingTargetId) {
			return;
		}

		if (!manualTargets.some((target) => target.id === editingTargetId)) {
			setEditingTargetId(null);
			setEditingLabelValue("");
			setEditingLabelError(null);
		}
	}, [editingTargetId, manualTargets]);

	useEffect(() => {
		if (!editingTargetId) {
			return;
		}

		const frameId = window.requestAnimationFrame(() => {
			editingLabelInputRef.current?.focus();
			editingLabelInputRef.current?.select();
		});

		return () => window.cancelAnimationFrame(frameId);
	}, [editingTargetId]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const validation = validateOverviewTargetDraft({
			raInput: targetDraftRa,
			decInput: targetDraftDec,
		});

		if (!validation.parsedCoordinate) {
			setErrors({
				ra: validation.raError,
				dec: validation.decError,
			});
			return;
		}

		commitManualTarget(
			buildOverviewManualTarget({
				labelInput: targetDraftLabel,
				coordinate: validation.parsedCoordinate,
				nextTargetSequence,
			}),
		);
		resetTargetDraft();
		setErrors({
			ra: null,
			dec: null,
		});
	};

	const handleToggleTargetSelection = (targetId: string) => {
		toggleSelectedTarget(targetId);
	};

	const handleTargetCardKeyDown = (
		event: KeyboardEvent<HTMLDivElement>,
		targetId: string,
	) => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		toggleSelectedTarget(targetId);
	};

	const handleStartEditing = (
		event: MouseEvent<HTMLButtonElement>,
		targetId: string,
		label: string,
	) => {
		event.stopPropagation();
		setEditingTargetId(targetId);
		setEditingLabelValue(label);
		setEditingLabelError(null);
	};

	const handleCancelEditing = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setEditingTargetId(null);
		setEditingLabelValue("");
		setEditingLabelError(null);
	};

	const handleSaveEditing = (
		event: MouseEvent<HTMLButtonElement>,
		targetId: string,
	) => {
		event.stopPropagation();

		const trimmedLabel = editingLabelValue.trim();
		if (trimmedLabel.length === 0) {
			setEditingLabelError("Label cannot be empty.");
			return;
		}

		updateManualTarget(targetId, { label: trimmedLabel });
		setEditingTargetId(null);
		setEditingLabelValue("");
		setEditingLabelError(null);
	};

	const handleDeleteTarget = (
		event: MouseEvent<HTMLButtonElement>,
		targetId: string,
	) => {
		event.stopPropagation();
		removeManualTarget(targetId);

		if (editingTargetId === targetId) {
			setEditingTargetId(null);
			setEditingLabelValue("");
			setEditingLabelError(null);
		}
	};

	return (
		<Box css={styles.root}>
			<Box px={4} py={4} flexShrink={0}>
				<Box css={styles.panel}>
					<form onSubmit={handleSubmit}>
						<Stack gap={3}>
							<Box>
								<Text css={styles.panelTitle}>Add Target</Text>
								<Text css={styles.panelDescription}>
									Committed targets persist locally. Valid draft coordinates
									appear on the globe before submit.
								</Text>
							</Box>

							<Stack gap={1.5}>
								<Text fontSize="xs" fontWeight="semibold" color="whiteAlpha.800">
									Label
								</Text>
								<Input
									ref={labelInputRef}
									value={targetDraftLabel}
									placeholder={`Target ${nextTargetSequence}`}
									onChange={(event) =>
										setTargetDraftLabel(event.target.value)
									}
									bg="rgba(255, 255, 255, 0.04)"
									borderColor="rgba(255, 255, 255, 0.16)"
									_focusVisible={{
										borderColor: "cyan.300",
										boxShadow: "0 0 0 1px rgba(103, 232, 249, 0.45)",
									}}
								/>
							</Stack>

							<Stack gap={3} direction={{ base: "column", md: "row" }}>
								<Stack gap={1.5} flex="1">
									<Text
										fontSize="xs"
										fontWeight="semibold"
										color="whiteAlpha.800"
									>
										RA (deg)
									</Text>
									<Input
										value={targetDraftRa}
										placeholder="e.g. 132.514"
										onChange={(event) =>
											setTargetDraftRa(event.target.value)
										}
										bg="rgba(255, 255, 255, 0.04)"
										borderColor={
											errors.ra
												? "rgba(252, 129, 129, 0.7)"
												: "rgba(255, 255, 255, 0.16)"
										}
										_focusVisible={{
											borderColor: errors.ra ? "red.300" : "cyan.300",
											boxShadow: errors.ra
												? "0 0 0 1px rgba(252, 129, 129, 0.32)"
												: "0 0 0 1px rgba(103, 232, 249, 0.45)",
										}}
										fontFamily="mono"
									/>
									{errors.ra ? (
										<Text fontSize="xs" color="red.200">
											{errors.ra}
										</Text>
									) : null}
								</Stack>

								<Stack gap={1.5} flex="1">
									<Text
										fontSize="xs"
										fontWeight="semibold"
										color="whiteAlpha.800"
									>
										Dec (deg)
									</Text>
									<Input
										value={targetDraftDec}
										placeholder="e.g. -12.408"
										onChange={(event) =>
											setTargetDraftDec(event.target.value)
										}
										bg="rgba(255, 255, 255, 0.04)"
										borderColor={
											errors.dec
												? "rgba(252, 129, 129, 0.7)"
												: "rgba(255, 255, 255, 0.16)"
										}
										_focusVisible={{
											borderColor: errors.dec ? "red.300" : "cyan.300",
											boxShadow: errors.dec
												? "0 0 0 1px rgba(252, 129, 129, 0.32)"
												: "0 0 0 1px rgba(103, 232, 249, 0.45)",
										}}
										fontFamily="mono"
									/>
									{errors.dec ? (
										<Text fontSize="xs" color="red.200">
											{errors.dec}
										</Text>
									) : null}
								</Stack>
							</Stack>

							<Separator borderColor="rgba(255, 255, 255, 0.08)" />

							<Stack
								direction={{ base: "column", md: "row" }}
								align={{ base: "stretch", md: "center" }}
								justify="space-between"
								gap={3}
							>
								<Text fontSize="xs" color="whiteAlpha.600">
									{parsedDraftCoordinate
										? `Draft preview: RA ${parsedDraftCoordinate.ra.toFixed(
												targetCoordinatePrecision,
										  )}°, Dec ${parsedDraftCoordinate.dec.toFixed(
												targetCoordinatePrecision,
										  )}°`
										: "Enter valid RA and Dec to preview the target on the globe."}
								</Text>
								<Button type="submit" colorPalette="cyan">
									Add Target
								</Button>
							</Stack>
						</Stack>
					</form>
				</Box>
			</Box>

			<Box px={4} pb={4} flex="1 1 auto" minH={0}>
				<Box css={styles.panel} h="100%" minH={0} display="flex" flexDirection="column">
					<Stack gap={3} flexShrink={0}>
						<Box>
							<Text css={styles.panelTitle}>Target List</Text>
							<Text css={styles.panelDescription}>
								Select targets from the list, rename labels inline, or delete
								them directly. Selection updates the canvas color immediately.
							</Text>
						</Box>
					</Stack>

					<ScrollArea.Root flex="1 1 auto" minH={0} mt={3}>
						<ScrollArea.Viewport>
							<ScrollArea.Content pr={2}>
								{sortedTargets.length === 0 ? (
									<Text fontSize="sm" color="whiteAlpha.700">
										No committed targets yet. Add one manually, fill the form
										from the canvas in target mode, then manage it here.
									</Text>
								) : (
									<Stack gap={2.5}>
										{sortedTargets.map((target) => {
											const isSelected = selectedTargetIds.includes(target.id);
											const isEditing = editingTargetId === target.id;

											return (
												<Box
													key={target.id}
													px={3}
													py={3}
													borderWidth="1px"
													borderColor={
														isSelected
															? "rgba(34, 211, 238, 0.72)"
															: "rgba(255, 255, 255, 0.12)"
													}
													borderRadius="lg"
													bg={
														isSelected
															? "rgba(34, 211, 238, 0.12)"
															: "rgba(255, 255, 255, 0.03)"
													}
													cursor="pointer"
													transition="border-color 0.16s ease, background 0.16s ease"
													_hover={{
														borderColor: isSelected
															? "rgba(34, 211, 238, 0.82)"
															: "rgba(255, 255, 255, 0.22)",
													}}
													role="button"
													tabIndex={0}
													aria-pressed={isSelected}
													onClick={() =>
														handleToggleTargetSelection(target.id)
													}
													onKeyDown={(event) =>
														handleTargetCardKeyDown(event, target.id)
													}
												>
													<Stack gap={2.5}>
														{isEditing ? (
															<Stack gap={2}>
																<Input
																	ref={editingLabelInputRef}
																	value={editingLabelValue}
																	onClick={(event) => event.stopPropagation()}
																	onKeyDown={(event) => event.stopPropagation()}
																	onChange={(event) => {
																		setEditingLabelValue(event.target.value);
																		if (editingLabelError) {
																			setEditingLabelError(null);
																		}
																	}}
																	bg="rgba(255, 255, 255, 0.04)"
																	borderColor={
																		editingLabelError
																			? "rgba(252, 129, 129, 0.7)"
																			: "rgba(255, 255, 255, 0.16)"
																	}
																	_focusVisible={{
																		borderColor: editingLabelError
																			? "red.300"
																			: "cyan.300",
																		boxShadow: editingLabelError
																			? "0 0 0 1px rgba(252, 129, 129, 0.32)"
																			: "0 0 0 1px rgba(103, 232, 249, 0.45)",
																	}}
																/>
																{editingLabelError ? (
																	<Text fontSize="xs" color="red.200">
																		{editingLabelError}
																	</Text>
																) : null}
																<HStack gap={2}>
																	<Button
																		size="xs"
																		colorPalette="cyan"
																		onKeyDown={(event) => event.stopPropagation()}
																		onClick={(event) =>
																			handleSaveEditing(event, target.id)
																		}
																	>
																		Save
																	</Button>
																	<Button
																		size="xs"
																		variant="outline"
																		colorPalette="gray"
																		onKeyDown={(event) => event.stopPropagation()}
																		onClick={handleCancelEditing}
																	>
																		Cancel
																	</Button>
																</HStack>
															</Stack>
														) : (
															<HStack
																align="start"
																justify="space-between"
																gap={3}
															>
																<Box flex="1 1 auto" minW={0}>
																	<Text
																		fontSize="sm"
																		fontWeight="semibold"
																		color="white"
																		overflow="hidden"
																		textOverflow="ellipsis"
																		whiteSpace="nowrap"
																	>
																		{target.label}
																	</Text>
																	<Text
																		mt={1}
																		fontSize="xs"
																		fontFamily="mono"
																		color="whiteAlpha.700"
																	>
																		RA {target.ra.toFixed(targetCoordinatePrecision)}° / Dec{" "}
																		{target.dec.toFixed(targetCoordinatePrecision)}°
																	</Text>
																</Box>
																<HStack gap={2} flexShrink={0}>
																	<Button
																		size="xs"
																		variant="outline"
																		colorPalette="gray"
																		onKeyDown={(event) => event.stopPropagation()}
																		onClick={(event) =>
																			handleStartEditing(
																				event,
																				target.id,
																				target.label,
																			)
																		}
																	>
																		Edit
																	</Button>
																	<Button
																		size="xs"
																		variant="outline"
																		colorPalette="red"
																		onKeyDown={(event) => event.stopPropagation()}
																		onClick={(event) =>
																			handleDeleteTarget(event, target.id)
																		}
																	>
																		Delete
																	</Button>
																</HStack>
															</HStack>
														)}
													</Stack>
												</Box>
											);
										})}
									</Stack>
								)}
							</ScrollArea.Content>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar>
							<ScrollArea.Thumb />
						</ScrollArea.Scrollbar>
						<ScrollArea.Corner />
					</ScrollArea.Root>
				</Box>
			</Box>
		</Box>
	);
}
