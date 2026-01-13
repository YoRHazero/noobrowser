import { Box, Heading, HStack, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { InfoTip } from "@/components/ui/toggle-tip";
import { sectionHeaderRecipe } from "../recipes/section-header.recipe";

interface SectionHeaderProps {
	title: string;
	tip?: string;
	leftSlot?: ReactNode;
	rightSlot?: ReactNode;
}

export function SectionHeader({
	title,
	tip,
	leftSlot,
	rightSlot,
}: SectionHeaderProps) {
	const recipe = useSlotRecipe({ recipe: sectionHeaderRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.root}>
			<HStack css={styles.left}>
				<Heading css={styles.title}>{title}</Heading>
				{tip ? <InfoTip content={tip} /> : null}
				{leftSlot ? <Box css={styles.leftSlot}>{leftSlot}</Box> : null}
			</HStack>
			{rightSlot ? <Box css={styles.rightSlot}>{rightSlot}</Box> : null}
		</HStack>
	);
}
