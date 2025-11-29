"use client"

import {
  ColorPicker,
  For,
  HStack,
  Portal,
  Stack,
  Tabs,
  VStack,
  getColorChannels,
  parseColor,
} from "@chakra-ui/react"
import { LuCheck } from "react-icons/lu"
export const DEFAULT_COLOR = "#eb5e41"
// 通道滑块（来自文档 ChannelSlider 示例）
const ChannelSliders = (props: { format: ColorPicker.ColorFormat }) => {
  const channels = getColorChannels(props.format)
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
  )
}

// 可选：让外部可以传默认色
type TabbedColorPickerProps = {
    onValueChange: (value: string) => void;
}

export const TabbedColorPicker = (props: TabbedColorPickerProps) => {
  const { onValueChange } = props;
  return (
    <ColorPicker.Root
      defaultValue={parseColor(DEFAULT_COLOR)}
      onValueChange={(details) => {
        onValueChange(details.value.toString("hex"))
      }}
      maxW="200px"
    >
      {/* 如果你要表单对接，可以加 HiddenInput */}
      <ColorPicker.HiddenInput />

      {/* 外部只显示颜色：一个小圆点触发器 */}
      <ColorPicker.Control>
        <ColorPicker.Trigger
          data-fit-content
          px="1.5"
          py="1"
        >
          <ColorPicker.ValueSwatch boxSize="6" rounded="inherit" />
        </ColorPicker.Trigger>
      </ColorPicker.Control>

      {/* 弹出内容 */}
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            {/* 上半部分：Tabs 切换 Slider / 取色板 */}
            <Tabs.Root defaultValue="picker" size="sm" variant="line">
              <Tabs.List mb="3">
                <Tabs.Trigger value="picker">picker</Tabs.Trigger>
                <Tabs.Trigger value="channels">channels</Tabs.Trigger>
              </Tabs.List>

              {/* Tab1：取色板（Area + Sliders） */}
              <Tabs.Content value="picker">
                <Stack gap="3">
                  <ColorPicker.Area />
                  <HStack>
                    <ColorPicker.EyeDropper size="xs" variant="outline" />
                    <ColorPicker.Sliders />
                  </HStack>
                </Stack>
              </Tabs.Content>

              {/* Tab2：通道滑块（多格式 ChannelSlider） */}
              <Tabs.Content value="channels">
                <Stack gap="3">
                  <ColorPicker.FormatSelect />
                  <ChannelSliders format="hsla" />
                  <ChannelSliders format="hsba" />
                  <ChannelSliders format="rgba" />
                </Stack>
              </Tabs.Content>
            </Tabs.Root>

            {/* 下半部分：Swatch + 输入框（两个 Tab 共用） */}
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

              {/* 这里用 hex 的 ChannelInput，也可以换成 ColorPicker.Input */}
              <ColorPicker.ChannelInput
                channel="hex"
                aria-label="Hex color"
              />
            </VStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  )
}

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
]
