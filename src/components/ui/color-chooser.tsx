"use client";

import {
	ColorPicker,
	For,
	getColorChannels,
	HStack,
	Portal,
	parseColor,
	Stack,
	Tabs,
	VStack,
} from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
export const DEFAULT_COLOR = "#eb5e41";
const ChannelSliders = (props: { format: ColorPicker.ColorFormat }) => {
	const channels = getColorChannels(props.format);
	return (
		<ColorPicker.View format={props.format}>
			<For each={channels}>
				{(channel) => (
					<Stack gap="1" key={channel}>
						<ColorPicker.ChannelText minW="5ch">
							{channel}
						</ColorPicker.ChannelText>
						<ColorPicker.ChannelSlider channel={channel} />
					</Stack>
				)}
			</For>
		</ColorPicker.View>
	);
};

type TabbedColorPickerProps = {
	value: string;
	onValueChange: (value: string) => void;
};

export const TabbedColorPicker = (props: TabbedColorPickerProps) => {
	const { value, onValueChange } = props;
	return (
		<ColorPicker.Root
			value={parseColor(value)}
			onValueChange={(details) => {
				onValueChange(details.value.toString("hex"));
			}}
			maxW="200px"
		>
			<ColorPicker.HiddenInput />
			<ColorPicker.Control>
				<ColorPicker.Trigger data-fit-content px="1.5" py="1">
					<ColorPicker.ValueSwatch boxSize="6" rounded="inherit" />
				</ColorPicker.Trigger>
			</ColorPicker.Control>

			<Portal>
				<ColorPicker.Positioner>
					<ColorPicker.Content>
						<Tabs.Root defaultValue="picker" size="sm" variant="line">
							<Tabs.List mb="3">
								<Tabs.Trigger value="picker">picker</Tabs.Trigger>
								<Tabs.Trigger value="channels">channels</Tabs.Trigger>
							</Tabs.List>

							<Tabs.Content value="picker">
								<Stack gap="3">
									<ColorPicker.Area />
									<HStack>
										<ColorPicker.EyeDropper size="xs" variant="outline" />
										<ColorPicker.Sliders />
									</HStack>
								</Stack>
							</Tabs.Content>

							<Tabs.Content value="channels">
								<Stack gap="3">
									<ColorPicker.FormatSelect />
									<ChannelSliders format="hsla" />
									<ChannelSliders format="hsba" />
									<ChannelSliders format="rgba" />
								</Stack>
							</Tabs.Content>
						</Tabs.Root>

						<VStack mt="4" align="stretch" gap="3">
							<ColorPicker.SwatchGroup>
								{swatches.map((item) => (
									<ColorPicker.SwatchTrigger key={item} value={item}>
										<ColorPicker.Swatch boxSize="4.5" value={item}>
											<ColorPicker.SwatchIndicator>
												<LuCheck />
											</ColorPicker.SwatchIndicator>
										</ColorPicker.Swatch>
									</ColorPicker.SwatchTrigger>
								))}
							</ColorPicker.SwatchGroup>

							<ColorPicker.ChannelInput channel="hex" aria-label="Hex color" />
						</VStack>
					</ColorPicker.Content>
				</ColorPicker.Positioner>
			</Portal>
		</ColorPicker.Root>
	);
};

// 预设 swatch 颜色（跟文档示例一致）
const swatches = [
	"#000000",
	"#4A5568",
	"#F56565",
	"#ED64A6",
	"#9F7AEA",
	"#6B46C1",
	"#4299E1",
	"#0BC5EA",
	"#00B5D8",
	"#38B2AC",
	"#48BB78",
	"#68D391",
	"#ECC94B",
	"#DD6B20",
];
