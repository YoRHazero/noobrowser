# Target Hub Sheet Architecture Spec

## 目的

这份文档定义 `src/features/target-hub/sheet` 的全新代码组织方式、职责边界和实现约束。

这是一份独立设计文档，不依赖仓库中现有文档，也不以兼容旧 feature 为目标。

## 适用范围

本规范只约束 `TargetHubSheet` 及其直接相关的代码组织。

它重点解决下面几件事：

- 让 `sheet` 的组织方式和 `dock`、`beacon` 一致
- 把业务逻辑从展示组件中剥离出去
- 明确 `sheet` 局部状态和 `target-hub` 全局状态的边界
- 限制 props 和样式的传递方式，避免组件接口继续膨胀

本规范不要求当前仓库中的 `dock`、`beacon` 立刻满足同样规则。

## 核心原则

- `TargetHubSheet` 是一个独立 feature，不以兼容旧 `source / target / tracesource` 结构为目标。
- 展示组件和业务逻辑必须分层。
- 只在真正需要跨模式共享时，才把状态放进 `target-hub` 全局 store。
- `sheet` 根层只负责组装，不承载业务逻辑。
- 样式应由组件内部消费，不应通过 props 跨层传递。
- 组件 props 应保持收敛；当一个组件开始承担过多职责时，应拆为文件夹级容器。

## 目录结构

`src/features/target-hub/sheet` 的目标结构如下：

```text
sheet/
  animations/
  components/
  hooks/
  recipes/
  store/
  utils.ts
  index.tsx
  TargetHubSheet.tsx
  SourceEditorPanel/
    index.tsx
    useSourceEditorPanel.ts
    ...
```

允许存在零个或多个类似 `SourceEditorPanel/` 的容器文件夹。

## 各层职责

### `animations/`

只放动画和过渡相关实现。

- 动画常量
- motion variants
- 进入/退出过渡逻辑
- 与视觉动效直接相关的工具

不放：

- store 读写
- query 调用
- 业务状态分支

### `components/`

只放 dumb components。

这些组件的职责是：

- 接收数据
- 接收语义化 props
- 渲染 UI
- 在组件内部使用对应的 recipe

这些组件不允许做的事情：

- 不直接读写 store
- 不直接调用 query hook
- 不持有业务交互逻辑
- 不做跨组件编排
- 不通过 props 接收 `css`、`style`、`recipe result`

`components/` 中的组件只能接收两类 props：

- 数据 props
- 语义 props

例如：

- `variant`
- `size`
- `state`
- `dense`
- `disabled`

不允许把样式对象作为 props 传递。

### `hooks/`

只放业务逻辑和数据连接层。

这些 hook 负责：

- 读取和写入 zustand store
- 调用 TanStack Query hooks
- 组织事件处理函数
- 计算 view model
- 处理组件之间的组合逻辑

这些 hook 不负责：

- 直接渲染 UI
- 输出样式对象给上层继续透传

命名约束：

- 组件容器 `Xxx.tsx` 如果承载业务逻辑，必须配套 `useXxx.ts`
- `useXxx.ts` 应与对应容器的职责对齐

### `recipes/`

只放样式定义。

规则如下：

- `recipes/` 中的样式只由对应组件内部消费
- 上层组件不应把 recipe 结果当成 props 往下传
- 上层组件也不应把裸 `css` / `style` 透传给下层组件

如果某个组件需要多种视觉形式，应优先使用语义化变体，而不是暴露裸样式入口。

### `store/`

只放 `sheet` 局部状态的 slice。

这里的状态必须满足一个条件：

- 这个状态只在 `sheet` 内成立，即使未来 `dock`、`beacon` 存在，也不应共享它

典型例子：

- `editorMode`
- 只属于 `sheet` 面板内部的 UI 开关
- 只属于 `sheet` 编辑过程的局部草稿态

不应放进 `sheet/store` 的状态：

- `sources`
- 明确属于整个 `TargetHub` 的跨模式状态

### `target-hub/store/globalSlice.ts`

放 `TargetHub` 级共享状态。

至少包括：

- `sources`

并且未来凡是满足下面条件的状态，也应进入全局 slice：

- 不只被 `sheet` 使用
- 明显属于整个 `TargetHub` 的统一语义
- 后续可能被 `icon`、`dock`、`sheet` 共同消费

## 根目录文件职责

### `index.tsx`

作为 `sheet` 的对外导出入口。

职责只包括：

- export 最终公开组件
- export 必要类型或无副作用工具

不承载业务逻辑。

### `utils.ts`

只放纯函数工具。

例如：

- 数据格式化
- 派生显示文案
- 局部排序与映射
- 与 UI 无关的轻量计算

不放：

- hook
- store
- query
- 组件组装逻辑

### 根目录组装文件

根目录可以有一个最终组装用的 `.tsx` 文件，例如 `TargetHubSheet.tsx`。

这个文件只做一件事：

- 组装没有 props 的容器组件

约束如下：

- 不承载业务逻辑
- 不直接处理 query/store
- 不做复杂条件分发
- 不把样式作为 props 向下传

## 容器组件规则

当一个组件开始出现下面迹象时，应提升为文件夹级容器：

- props 数量超过 7 个
- 同时承担状态读取、事件处理和大量展示拼装
- 已经很难通过一个扁平 `.tsx` 文件表达清楚

提升后的结构示例：

```text
SourceEditorPanel/
  index.tsx
  useSourceEditorPanel.ts
  Header.tsx
  Fields.tsx
  Actions.tsx
```

规则如下：

- 文件夹名应省略与父层重复的前缀
- 文件夹内的 `index.tsx` 负责组装出没有 props 的容器组件
- 文件夹内允许存在带 props 的局部子组件
- 这些局部子组件可以使用 `components/` 中的 dumb components
- 容器内的业务逻辑必须落在 `useXxx.ts`

## Props 约束

所有组件都应尽量控制 props 数量和职责范围。

默认要求：

- 一个组件的 props 数量不应超过 7 个
- 超过时优先检查是否混入了布局、样式、数据、行为四类不同职责
- 如果是，应拆容器，而不是继续堆 props

这里的重点不是机械追求数字本身，而是防止接口继续失控。

## 样式约束

样式规则统一如下：

- `components/` 组件自己 import 和使用对应 recipe
- 不通过 props 传递 `css`
- 不通过 props 传递 `style`
- 不通过 props 传递 recipe 结果
- 不通过上层容器集中拼接大块样式对象后再分发

如果需要视觉变化，只允许通过语义化 props 表达。

例如：

- `variant="active"`
- `size="sm"`
- `state="empty"`
- `dense={true}`

## 业务逻辑边界

下面这些逻辑属于 `hooks/` 或更上层容器，不属于 dumb components：

- store 与 query 的交互
- source 的增删改查
- active source 切换
- editor mode 切换
- query 参数组装
- 与外部页面上下文的同步

下面这些逻辑可以留在 dumb components 内：

- 本地 hover
- 纯视觉展开/折叠表现
- 只影响组件自身渲染的临时 UI 状态

前提是它们不影响业务语义，也不与 store/query 耦合。

## 命名与复用约束

- `TargetHubSheet` 根层文件可保留完整 feature 前缀
- 已经位于 `sheet/` 作用域内的容器文件夹，应省略重复前缀
- 纯展示组件命名以职责为主，不以数据来源命名
- hook 命名应直接表达行为或容器职责

## 实施检查清单

在新增或重构 `sheet` 代码时，应逐项检查：

- 这个状态到底是 `sheet` 局部状态，还是 `TargetHub` 全局状态
- 这个组件是否只是展示组件
- 这个文件是否同时在做组装、状态管理和样式分发
- 是否把样式当成 props 继续往下传了
- props 是否已经失控，应该提升为容器文件夹
- 业务逻辑是否已经从 UI 中抽到 `useXxx.ts`

## 非目标

这份规范当前不覆盖：

- `dock` 和 `beacon` 的补齐性改造
- 旧 feature 的兼容方案
- 具体 query 接入方式
- 具体视觉方案细节
- 旧目录结构的立即迁移策略

这份规范只定义 `TargetHubSheet` 后续实现时必须遵守的代码组织方式和职责边界。
