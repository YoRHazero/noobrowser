"use client";

import {
    Box,
	CloseButton,
	Drawer,
	Flex,
	IconButton,
	Separator,
	Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuSettings2 } from "react-icons/lu";

import PriorOperations from "@/features/grism/forwardprior/PriorOperations";
import PriorSelector from "@/features/grism/forwardprior/PriorSelector";
import PriorForm from "@/features/grism/forwardprior/PriorForm";

export default function GrismForwardPriorDrawer() {
	const [isOpen, setIsOpen] = useState(false);

	// 选中的模型 ID
	const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
	// 选中的参数名 (例如 'k', 'sigma')
	const [selectedParam, setSelectedParam] = useState<string | null>(null);

	return (
		<Drawer.Root
			open={isOpen}
			onOpenChange={(e) => setIsOpen(e.open)}
			size="md" // 1. 改窄一点 (xl -> md)
		>
			<Drawer.Trigger asChild>
				<IconButton
					aria-label="Advanced Prior Settings"
					variant="ghost"
					size="xs"
					onClick={() => setIsOpen(true)}
				>
					<LuSettings2 />
				</IconButton>
			</Drawer.Trigger>

			<Drawer.Backdrop />
			<Drawer.Positioner>
				<Drawer.Content>
					<Drawer.Header>
						<Drawer.Title>Prior Configuration</Drawer.Title>
						{/* 2. 使用 CloseButton 替换默认 Trigger */}
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Drawer.CloseTrigger>
					</Drawer.Header>

					<Drawer.Body p={0}>
						<Flex direction="column" h="full">
							{/* 顶部：批量操作 */}
							<Stack p={4} pb={2} gap={4}>
								<PriorOperations />
							</Stack>

							<Separator />

							<Flex
								h="180px" // 固定高度给列表
								p={4}
								justify="center" // 居中 PriorSelector
								bg="bg.subtle"
								borderBottomWidth="1px"
								borderColor="border.subtle"
							>
								<PriorSelector
									selectedModelId={selectedModelId}
									selectedParam={selectedParam}
									onSelectModel={(id) => {
										setSelectedModelId(id);
										setSelectedParam(null);
									}}
									onSelectParam={setSelectedParam}
								/>
							</Flex>
                            {/* 底部：Prior 配置表单 */}
                            <Box flex="1" overflowY="auto" p={4}>
                                {selectedModelId && selectedParam ? (
                                    <PriorForm
                                        modelId={selectedModelId}
                                        paramName={selectedParam}
                                    />
                                ) : (
                                    <Stack
                                        h="full"
                                        justify="center"
                                        align="center"
                                        color="fg.muted"
                                    >
                                        <Box>Select a model and parameter to configure its prior.</Box>
                                    </Stack>
                                )}
                            </Box>
						</Flex>
					</Drawer.Body>					
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}