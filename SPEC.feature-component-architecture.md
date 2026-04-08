# Feature Component Architecture Spec

## 目的

这份文档定义 `src/features/*` 下功能模块的通用代码组织规则。

目标不是约束某一个具体 feature 的业务细节，而是定义一套稳定的分层方式，让 feature 在继续增长时仍然具备：

- 清晰的职责边界
- 可维护的目录结构
- 可控的 props 接口
- 可复用的展示组件
- 可收敛的业务逻辑

这是一份独立设计文档，不依赖仓库中的现有文档。

## 适用范围

本规范适用于：

- `src/features/<feature>`
- `src/features/<feature>/<subfeature>`

也就是说，这份规范既适用于一个完整 feature，也适用于 feature 内部的子模块。

## 核心原则

- feature 是按业务语义组织的，不是按技术类型平铺的。
- 展示组件、业务逻辑、样式、状态应分层。
- 根层文件只负责组装，不负责承载业务逻辑。
- 只有真正需要共享的状态，才应提升到 feature 级 store。
- 样式必须内聚在组件内部，不应跨层通过 props 传递。
- 当一个组件开始承担过多职责时，应提升为容器文件夹，而不是继续堆 props。

## feature 推荐目录

一个 feature 的目标结构如下：

```text
src/features/<feature>/
  animations/
  components/
  hooks/
  recipes/
  shared/
  store/
  utils.ts （或者 utils/）
  index.ts
  <FeatureRoot>.tsx
  <ContainerA>/
    index.tsx
    use<ContainerA>.ts
  <ContainerB>/
    index.tsx
    use<ContainerB>.ts
```

允许存在零个或多个容器文件夹。

如果 feature 规模较大，也允许在内部再划分子目录，例如：

```text
src/features/<feature>/
  editor/
  list/
  detail/
  shared/
  store/
  components/
  ...
```

但不论是否拆子目录，都应遵守同样的职责边界。

## 分层职责

### `components/`

`components/` 只放 dumb components。

它们的职责是：

- 接收数据
- 接收语义化 props
- 渲染 UI
- 在组件内部消费自己的 recipe

它们不负责：

- 读写 store
- 调用 query hook
- 组织业务流程
- 处理跨组件状态同步
- 承担上层容器的组装逻辑

如果一个“被多个地方复用”的组件开始读写 store、调用 query、组合 action、或者封装明确业务规则，它就不再属于 `components/`。

此时应把它提升为独立业务目录，例如：

```text
projection/
  index.tsx
  ProjectionControls.tsx
  useProjectionControls.ts
  components/
```

“会被多个地方使用”不等于“应该放进 `components/`”。判断标准是它是否只承担复用 UI。

### `shared/`

`shared/` 是可选目录，只放低耦合、无明确业务 owner 的基础定义。

优先放这里的内容：

- `types.ts`
- `constants.ts`
- 极少量跨子域复用、且不属于任何业务 owner 的纯函数工具

不应放这里的内容：

- 业务组件
- 业务 hooks
- store slices
- query hooks
- 会读写 store 或 query 的复用模块

如果某个 `type / constant / utils` 明显只属于一个子域，应 colocate 在该子域目录，而不是硬塞进 `shared/`。

### `hooks/`

`hooks/` 是 feature 的业务逻辑层。

这里负责：

- 读取和写入 store
- 调用 query hooks
- 组装 view model
- 封装事件处理函数
- 管理 feature 内业务交互

如果某个组件文件需要明显的业务逻辑，它应拥有对应的 `useXxx.ts`，而不是把逻辑直接塞进展示组件。

如果这份业务逻辑已经形成一个稳定的复用能力，并被多个子模块消费，优先给它一个明确的业务目录，而不是继续把它伪装成 `shared hook`。

### `recipes/`

`recipes/` 只放样式定义。

规则如下：

- 样式只由对应组件内部消费
- 不通过 props 传递 `css`
- 不通过 props 传递 `style`
- 不通过 props 传递 recipe 结果

组件若需要视觉变化，只能暴露语义化视觉变体，例如：

- `variant`
- `size`
- `state`
- `dense`

### `store/`

`store/` 只放这个 feature 自己的状态。

feature 内部的 store 应继续分层：

- feature 全局状态
- subfeature 局部状态

判断标准如下：

- 若一个状态只在某个子模块中成立，应放在对应子模块的 `store/`
- 若一个状态属于整个 feature 的统一语义，应放在 feature 根层 `store/`

不要因为“未来可能会复用”就提前把状态提升到全局。

### `animations/`

`animations/` 只放动效相关内容。

例如：

- motion variants
- transition constants
- feature 级动画工具

不放：

- 业务逻辑
- store 交互
- query 交互

### `utils.ts`

只放纯函数工具。

例如：

- 格式化
- 排序
- 映射
- 轻量派生计算

不放：

- hook
- store
- query
- 组件树组装

## 根层文件规则

### `index.ts`

作为 feature 的导出入口。

职责只包括：

- export feature 的公开组件
- export 必要类型
- export 无副作用工具

不承载业务逻辑。

### `<FeatureRoot>.tsx`

这是 feature 的最终组装文件。

它只负责：

- 组装没有 props 的容器组件
- 描述 feature 的总体结构

它不负责：

- 直接读写 query/store
- 定义复杂事件逻辑
- 把样式对象逐层往下传

换句话说，根层组装文件应尽量接近“声明式骨架”。

## 容器组件规则

当某个组件满足下面任一条件时，应提升为容器文件夹：

- props 数量超过 7 个
- 同时承担状态读取、业务交互、多个区块拼装
- 文件已经明显混合了展示逻辑和业务逻辑
- 未来大概率继续扩张

推荐结构：

```text
<ContainerName>/
  index.tsx
  use<ContainerName>.ts
  <SubViewA>.tsx
  <SubViewB>.tsx
```

规则如下：

- `index.tsx` 组装出没有 props 的容器组件
- `use<ContainerName>.ts` 管理该容器的业务逻辑
- 容器内允许存在带 props 的局部子组件
- 这些局部子组件可以继续使用 `components/` 中的 dumb components

如果某个容器内部的局部能力开始被多个业务区块共同使用，不要急着把它移进 `shared/`。先判断它是：

- 复用 UI：进入 `components/`
- 基础定义：进入 `shared/`
- 业务能力：提升成独立业务目录

### 子域目录模板

当一个子域已经拥有独立目录时，默认应使用下面的模板：

```text
<domain>/
  index.tsx
  use<Domain>.ts
  <Domain>View.tsx
  components/
  hooks/
```

约束如下：

- `index.tsx` 是该目录的主容器入口
- `index.tsx` 默认直接完成 `use<Domain>() + <Domain>View />` 的组装
- `components/` 只放这个子域内部的 dumb components
- `hooks/` 只在该子域逻辑继续拆分时再建立

如果子域足够简单，也可以省略单独的 `<Domain>View.tsx` 或 `use<Domain>.ts`，把少量逻辑直接放进 `index.tsx`。但即使如此，也不应保留纯转发包装层。

默认不要写成：

```text
<domain>/
  index.tsx
  <Domain>.tsx
  use<Domain>.ts
  <Domain>View.tsx
```

如果 `index.tsx` 只是单纯转发到同层的 `<Domain>.tsx`，那么这层 `<Domain>.tsx` 通常没有存在价值，应折叠回 `index.tsx`。

只有在下面情况成立时，才允许保留额外包装层：

- `index.tsx` 作为公共导出入口，而真正的容器属于另一个明确子域
- 包装层本身承担了额外职责，而不只是转发
- 该目录同时暴露多个不同容器，而 `index.tsx` 需要显式编排它们

## Props 设计规则

组件 props 应尽量只表达：

- 数据
- 行为
- 语义化视觉变体

不应表达：

- 跨层样式对象
- 无边界的布局覆写
- 原本应由 hook 派生的业务状态

默认约束：

- 一个组件的 props 不应超过 7 个
- 当 props 开始包含数据、事件、布局、样式、状态五类混杂内容时，应拆容器

这个规则的目标不是追求数字本身，而是防止接口失控。

## 样式规则

所有 feature 都遵守同一条样式原则：

- `components/` 组件自己使用 recipe
- 上层不传 `css`
- 上层不传 `style`
- 上层不传 recipe 结果

如果某个组件需要多种视觉形式，应把差异收敛成语义 props，而不是开放裸样式入口。

## 状态提升规则

状态放在哪里，按“作用域”判断，不按“实现方便”判断。

### 放在 subfeature local store 的情况

- 只在当前子模块内成立
- 只影响当前子模块的 UI
- 不会被 feature 内其它模块复用

### 放在 feature global store 的情况

- 属于整个 feature 的统一语义
- 会被多个子模块共同消费
- 它的变化会影响 feature 的多个区域

### 不应过早提升的情况

- 只是一个容器内部的暂时草稿
- 只是一个编辑面板的开关
- 只是当前一步交互的中间值

## Query 与 store 的边界

通用原则：

- 远程数据本体优先留在 TanStack Query
- zustand store 用于本地 UI 状态、草稿态、选择态、模式态
- 不要为了“好拿到”就把 query 结果复制进 store

适合放 query 的内容：

- 接口返回的数据
- 请求状态
- 缓存身份

适合放 store 的内容：

- 当前选中项
- 当前模式
- 输入草稿
- 本地开关

## 组件纯度规则

可以保留在 dumb components 内的逻辑：

- hover
- focus
- 本地展开/收起表现
- 不影响业务语义的临时视觉状态

不应留在 dumb components 内的逻辑：

- store 交互
- query 交互
- 跨组件通信
- 数据源切换
- 业务流程判断

一旦出现上述逻辑，这个文件就不应再被视为 `components/` 中的 dumb component，即使它被多个地方复用也是如此。

## 命名规则

- feature 根层组件可以保留 feature 前缀
- 进入某个子目录后，应省略重复前缀
- hook 名称应直接表达容器或行为职责
- pure component 名称应表达 UI 角色，而不是数据来源

## 大型 feature 的拆分规则

一个 feature 继续增长时，不应继续把所有内容堆在同一层目录。

推荐拆分方式：

- 先按主业务区块拆成子目录
- 每个子目录内部继续遵守本规范
- 仅把真正共享的 `components / shared / store / utils` 留在 feature 根层

不要先按“表单 / 列表 / 卡片 / hooks / styles”硬切一层大平铺，再把所有业务揉在一起。

优先按业务区块建骨架，再在区块内部按技术职责分层。

进一步的目录判断规则：

- 复用 UI 放 `components/`
- 基础定义放 `shared/`
- 业务复用模块不要放进 `shared/`，而是直接升格成独立子目录
- `shared/` 不应成为“暂时不好归类的业务代码收容所”

## 评审检查清单

在新增或重构 feature 代码时，应逐项检查：

- 这个组件是不是 dumb component
- 这个文件是不是同时在做 UI、store、query、样式分发
- 这个状态到底是局部的，还是 feature 级共享的
- 有没有把 query 数据复制进 store
- 有没有把样式对象当 props 继续下传
- props 是否已经说明这个组件职责过载
- 是否应该提升成容器文件夹并抽出 `useXxx.ts`

## 非目标

这份规范不直接定义：

- 具体 UI 视觉设计
- 具体动画方案
- 具体数据模型
- feature 之间的依赖关系
- 某一个现有 feature 的迁移计划

它只定义 `src/features/*` 下功能模块的通用代码组织规则和实现约束。
