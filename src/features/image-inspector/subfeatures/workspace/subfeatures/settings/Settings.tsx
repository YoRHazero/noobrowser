"use client";

import { Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { settingsRecipe } from "./Settings.recipe";
import { useSettings } from "./useSettings";

export function Settings() {
	const recipe = useSlotRecipe({ recipe: settingsRecipe });
	const styles = recipe();
	const settings = useSettings();
	const rows = [
		["Interpolation", settings.interpolation],
		["Camera", settings.cameraMode],
		["Right Rail", settings.sideRail],
		["Cache", settings.cachePolicy],
	] as const;

	return (
		<Stack css={styles.root}>
			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Workspace Defaults</Text>
				<Box css={styles.settingList}>
					{rows.map(([label, value]) => (
						<Box key={label} css={styles.settingRow}>
							<Text css={styles.label}>{label}</Text>
							<Text css={styles.value}>{value}</Text>
						</Box>
					))}
				</Box>
				<Text css={styles.note}>
					These controls reserve the settings boundary without mutating canvas
					unit internals.
				</Text>
			</Stack>
		</Stack>
	);
}
