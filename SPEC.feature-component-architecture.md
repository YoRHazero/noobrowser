# Feature Component Architecture Spec

## 目的

这份文档定义 `src/features/*` 下 feature 与 subfeature 的通用组织规则。

目标是让业务代码在持续增长时仍然保持：

- 清晰的业务边界
- 可递归复用的目录结构
- 可控的组件依赖方向
- 明确的 UI / view fragment / business unit 分层
- 单一 store root 下可聚合的 slice 组织方式

## 核心模型

所有业务目录统一抽象为 `Unit`：

```text
FeatureUnit = src/features/<feature>
SubfeatureUnit = <parent>/subfeatures/<subfeature>
```

`FeatureUnit` 和 `SubfeatureUnit` 递归遵守同一套结构，但有两个硬性差异：

- 只有顶层 `FeatureUnit` 可以拥有 `runtimes/`。
- 只有顶层 `FeatureUnit/store/index.ts` 可以创建真实 Zustand store；嵌套 `SubfeatureUnit/store/index.ts` 只能聚合和导出 slice / selector。

## 标准结构

```text
<Unit>/
  index.tsx
  <Unit>.tsx
  use<Unit>.ts

  components/                   optional
  parts/                        optional
  hooks/                        optional
  shared/                       optional
  store/                        optional
  utils/                        optional
  animations/                   optional
  subfeatures/                  optional
```

只有顶层 feature 额外允许：

```text
src/features/<feature>/
  runtimes/                     optional
```

禁止出现：

```text
<parent>/subfeatures/<subfeature>/runtimes/
```

## `index.tsx`

`index.tsx` 是 Unit 的唯一公开入口。

`index.tsx` 只负责公开入口，不参与 Unit 内部组装。

规则：

- `index.tsx` 应直接导出或渲染 `<Unit />`。
- `index.tsx` 不调用 `use<Unit>()`。
- `index.tsx` 不向 `<Unit />` 注入 Unit view model props。
- `<Unit>.tsx` 负责调用 `use<Unit>()` 并装配自己的 parts / subfeatures。
- `<Unit>.tsx` 不能直接 import 当前 Unit 的 `hooks/`、父 Unit hooks 或子 subfeature hooks。当前 Unit 的 hook 组合必须放在 `use<Unit>.ts`。
- `<Unit>.tsx` 可以 import parts / subfeatures / components / recipes，并把 `use<Unit>()` 返回的 view model 拆分后传给它们。

父级只能 import 子 Unit 的公开入口：

```ts
import Ned from "./subfeatures/ned";
```

禁止父级 import 子 Unit 的内部文件：

```ts
import { NedView } from "./subfeatures/ned/NedView";
```

如果顶层 feature 有 runtime，runtime 只能由顶层 feature 的 `index.tsx` 挂载：

```tsx
// src/features/<feature>/index.tsx
export default function FeatureEntry() {
  return (
    <>
      <FeatureRuntimes />
      <Feature />
    </>
  );
}
```

`<Feature>.tsx`、subfeature、part、component 都不能直接挂载 runtime。

## 简单 Unit

当 Unit 没有 `subfeatures/` 时，`<Unit>.tsx` 和 `use<Unit>.ts` 可以是该 Unit 的主要业务入口，但 `use<Unit>.ts` 仍然只做组合；具体副作用和生命周期逻辑放进 `hooks/useXxx.ts`：

```text
ned/
  index.tsx
  Ned.tsx
  useNed.ts
  parts/
  store/
```

## 复杂 Unit

当 Unit 出现 `subfeatures/` 后，`<Unit>.tsx` 和 `use<Unit>.ts` 只能作为 orchestration layer：

```text
sheet/
  index.tsx
  Sheet.tsx
  useSheet.ts
  parts/
    SheetShell.tsx
  subfeatures/
    editor/
    sources/
    ned/
```

允许：

- 装配子 subfeatures。
- 处理当前 Unit 自己的布局和外壳。
- 使用当前 Unit 的 `parts/` 做布局拆分。
- 读取父级 store / hooks 做跨 subfeature 编排。

禁止：

- 实现子 subfeature 的内部业务。
- 调用本应属于子 subfeature 的 query / mutation。
- 持有子 subfeature 私有状态。
- 构造横跨多个 subfeature 的大 view model。
- import sibling subfeature 的内部文件。

## `components/`

`components/` 只放可复用 UI primitives。它是视觉组件层，不是业务拆分层。

推荐结构：

```text
components/
  IconChip/
    IconChip.tsx
    IconChip.recipe.ts
    index.ts
```

硬性规则：

- 一个 component 对应自己的 recipe。
- component recipe 放在该 component 文件夹内。
- component 可以接收 props 和 callbacks。
- component props 留在组件文件或组件目录内，不放 `shared/types.ts`。
- component 不能读 feature store。
- component 不能调用 feature hooks、query hooks、mutation hooks、runtime hooks。
- component 不能 import sibling subfeature。
- component 不能 import 当前 Unit 的 `parts/`、`store/`、`hooks/`、`utils/`。
- component 只能依赖 `src/components`、当前 Unit 的 `shared/`，以及父 Unit 的 `components/`。

判断规则：

- 名字里出现业务词，默认不放 `components/`。
- 例如 `NedSettingsPanel`、`ExtractionSettingsPanel`、`SourceSpectrumPanel` 不属于 `components/`。
- 例如 `IconChip`、`MetricRow`、`InlineField` 可以属于 `components/`。

## recipe

recipe 的 owner 必须是具体 UI owner，而不是技术类型目录。

禁止：

- 创建 `recipes/` 目录。
- 创建一个 Unit 根部 `<unit>.recipe.ts` 来承载多个 parts / components 的 recipe。
- 让一个 part / component import 另一个 part / component 的 recipe。
- 在 TSX 里拼接大段静态 `css` 对象。
- 在 TSX 里根据 `tone`、`variant`、`isActive`、`isDisabled` 这类静态视觉状态拼样式对象。
- 在 TSX 里写 hover / focus / disabled 视觉规则。

允许：

- `<Unit>.tsx` 自己直接拥有样式时，使用同级 `<Unit>.recipe.ts`。
- `parts/<Part>/<Part>.tsx` 自己直接拥有样式时，使用同目录 `<Part>.recipe.ts`。
- `components/<Component>/<Component>.tsx` 自己直接拥有样式时，使用同目录 `<Component>.recipe.ts`。
- TSX 将语义状态传给 recipe，例如 `recipe({ tone, size, active })`。
- TSX 传少量运行时动态值，例如 `style={{ top: `${top}px` }}`。
- TSX 通过 CSS variable 传运行时动态颜色 / 尺寸，例如 `style={{ "--source-color": color } as CSSProperties }`。

推荐结构：

```text
parts/
  Shell/
    Shell.tsx
    Shell.recipe.ts
    index.ts

components/
  IconChip/
    IconChip.tsx
    IconChip.recipe.ts
    index.ts
```

recipe 负责：

- layout / spacing / size / radius / border。
- color token / semantic color。
- hover / active / disabled / focus 样式。
- slot 样式。
- variant 样式。
- animation name / transition 等静态视觉规则。

TSX 负责：

- DOM 结构。
- props 到 recipe variant 的映射。
- event handler。
- aria / semantic attributes。
- 少量运行时动态 style / CSS variable。

## `parts/`

`parts/` 是当前 Unit 私有的 feature-specific view fragments。它不是业务边界，只是把 view 拆小。

规则：

- 只服务最近的 owning Unit；在复杂 Unit 中，可以作为该 Unit 拥有的复用 view fragment 被直接 child subfeature 使用。
- 可以包含业务文案、业务字段名、业务 view model。
- 通常接收父级整理好的 props / model。
- 不直接读 store。
- 不调用 query / mutation。
- 不拥有业务流程状态。
- 不 import sibling subfeature。
- child subfeature 只能 import 最近父 Unit 的 `parts/` 公开入口，不能越级 import grandparent `parts/`。
- child subfeature 不能 import sibling subfeature 的 `parts/`。
- 被 child subfeature 复用的父级 part 必须保持 view fragment 属性：只通过 props / callbacks 接入行为，不读 store、不调用 query / mutation、不拥有业务流程状态。
- 如果 part 需要 recipe，必须升级为自己的文件夹，并持有同目录 `<Part>.recipe.ts`。
- 如果一个 part 只服务某个 child subfeature，必须放到那个 child subfeature 的 `parts/`。

例子：

```text
sheet/subfeatures/ned/
  Ned.tsx
  useNed.ts
  parts/
    SettingsPanel.tsx
    ResultsPanel.tsx
```

`Ned` 是 subfeature，`SettingsPanel` 和 `ResultsPanel` 是 NED 内部 parts。

父级 part 被多个直接 child subfeature 复用时，应留在父级 `parts/`：

```text
sheet/
  parts/
    ProjectionControls/
      ProjectionControls.tsx
      ProjectionControls.recipe.ts
      index.ts
  subfeatures/
    editor/
    sources/
```

`ProjectionControls` 由 `sheet` 拥有，可以被 `editor` 和 `sources` 使用；如果它只服务 `sources`，则必须下沉到 `sources/parts/`。

## `subfeatures/`

`subfeatures/` 放独立可见业务能力。

规则：

- 每个 subfeature 是一个完整 Unit。
- 可以拥有自己的 `use<Subfeature>.ts`、`parts/`、`components/`、`hooks/`、`shared/`、`store/`、`utils/`、`animations/`。
- 禁止拥有 `runtimes/`。
- sibling subfeatures 禁止互相 import。
- sibling subfeatures 只能通过父级 store / hooks 或更高层共享状态协作。
- 父 Unit 只装配 subfeature，不理解其内部状态。

props 规则：

- subfeature entry 倾向于不接收业务数据 props。
- 允许 identity / config props，例如 `sourceId`、`placement`、`mode`。
- 如果需要传完整 data object 和大量 callbacks，它通常是 `part`，不是 subfeature。

`SourceCard` 的判断：

```tsx
<SourceCard source={source} isActive={isActive} onSelect={onSelect} />
```

这更像 `parts/SourceCard.tsx` 或 presentational component。

```tsx
<SourceCard sourceId={source.id} />
```

这可以是 `subfeatures/sourceCard`，内部用 `useSourceCard(sourceId)` 读取父级 store。

## `store/`

所有有 store 的 Unit 都必须有 `store/index.ts`。

禁止预先创建空的 `store/`。

一个 Unit 只有在实际拥有本地状态 slice / selector 时，才应拥有 `store/`。

顶层 feature：

```text
src/features/<feature>/store/index.ts
```

允许创建真实 Zustand store。

嵌套 Unit：

```text
<Unit>/store/index.ts
```

禁止创建 store，只能：

- export 自己的 slice。
- export 自己的 `use<SliceName>Store` selector hook。
- re-export 子 subfeature 的 store 聚合。
- 给父级提供统一 import 面。

`store/index.ts` 是公开聚合边界，不是 leaf 文件的替代品。

应保留真实使用中的 leaf 文件，例如 `<name>Slice.ts`、`use<Name>Store.ts`。只有当 leaf 文件在迁移后确实不再被使用时，才可以删除。

父级从 child Unit 的 `store/` 入口 import；同一个 `store/` 内部可以继续 import 本地 leaf 文件。

父级只能从子 Unit 的 `store/` 公开入口 import：

```ts
import { createNedSlice } from "../subfeatures/ned/store";
```

禁止：

```ts
import { createNedSlice } from "../subfeatures/ned/store/nedSlice";
```

## `shared/`

`shared/` 只放当前 Unit 通用、低耦合定义。

允许：

- `types.ts`
- `constants.ts`

禁止：

- hook 输入输出类型。
- component props。
- query result 的包装类型。
- 只服务一个 part / subfeature 的局部类型。

## `utils/`

`utils/` 只放纯函数。

规则：

- 一个函数一个文件。
- `index.ts` 统一导出。
- 不允许在 utils 内新定义业务 types / constants。
- 只能使用原生 types，或当前 / 父级 `shared/types.ts`、`shared/constants.ts`。

## `hooks/`

`hooks/` 是当前 Unit 的业务 hook layer，用来承载当前 Unit 的具名行为拆分。

它不只服务“跨多个子组件复用”。如果某个子 hook 只被 `use<Unit>.ts` 使用，但它承载了清晰的业务行为或生命周期逻辑，也应该放在当前 Unit 的 `hooks/` 中。

允许：

- 放 `use<Unit>.ts` 拆出来的子 hook，例如 `useBeaconDrag.ts`、`useBeaconProximity.ts`。
- 放当前 Unit 内多个 parts / subfeatures 复用的 hook。
- 放生命周期与当前可见 Unit 一致的 effect / event / timer / observer 逻辑。
- 放当前 Unit 明确提供给 child subfeature 使用的公开 hook。
- 子 subfeature 私有 hook 放子 Unit 自己的 `hooks/`。

禁止：

- 放 runtime hook。
- 让 `components/` import 当前 Unit 的 `hooks/`。
- 让 sibling subfeature 互相 import 对方的 `hooks/`。
- 让父级 import child Unit 的私有 hook 文件。

导出规则：

- `hooks/` 中未从 `hooks/index.ts` 导出的 hook 视为当前 Unit 私有实现。
- 只有当当前 Unit 明确向 child subfeature 提供 hook 时，才从 `hooks/index.ts` 导出。
- child subfeature 的 `use<Child>.ts` 只能通过父 Unit 的 `hooks/index.ts` 调用父级公开 hook，不能 import 父级 `hooks/useXxx.ts` 私有文件。
- 如果需要使用祖先 Unit 的 hook，优先由最近的父 Unit 通过自己的 `hooks/index.ts` 明确转发或包装，避免 child subfeature 越级依赖祖先内部结构。

## `use<Unit>.ts`

`use<Unit>.ts` 是当前 Unit 的 composition hook，只负责组装当前 Unit 的 view model。

`use<Unit>.ts` 只应由当前 Unit 的 `<Unit>.tsx` 调用，不应由 `index.tsx` 或父级 Unit 直接调用。

`<Unit>.tsx` 不接收由 `use<Unit>.ts` 生成的 Unit model props；它应在文件内部调用 `use<Unit>()`。如果需要把数据继续传给 `parts/`，由 `<Unit>.tsx` 将 model 拆分后传入各个 part。

`<Unit>.tsx` 不能通过直接 import `hooks/` 绕过 `use<Unit>.ts`。即使 hook 属于同一个 Unit，也必须由 `use<Unit>.ts` 调用，保证组合边界明确。

允许：

- 调用当前 Unit `hooks/` 中的子 hook。
- 调用父 Unit 通过 `hooks/index.ts` 公开导出的 hook。
- 读取当前 Unit / 父 Unit 的公开 store selector。
- 组合 query hook 的返回数据和状态。
- 拼装传给 `<Unit>.tsx` / parts / subfeatures 的 view model。
- 定义很薄的事件 handler，例如只调用 store action 或子 hook 返回的方法。

禁止：

- 直接使用 `useEffect`、`useLayoutEffect`、`useInsertionEffect`。
- 直接注册 `window` / `document` 事件。
- 直接管理 timer / observer / worker / polling。
- 承载异步生命周期流程。
- 演变成横跨多个 subfeature 的大 view model。
- 被 `index.tsx` 或父级 Unit 直接调用。
- import 父 Unit 的私有 hook 文件，例如 `../hooks/useParentPrivateHook`。

如果逻辑生命周期与当前可见 Unit 一致，放到当前 Unit 的 `hooks/useXxx.ts`。

如果逻辑生命周期长于可见 Unit，提升到顶层 feature 的 `runtimes/`。

如果逻辑是可复用纯函数，放到当前 Unit 或父 Unit 的 `utils/`。

## `runtimes/`

`runtimes/` 只允许出现在顶层 feature：

```text
src/features/<feature>/runtimes/
```

用途：

- 后端轮询。
- 生命周期同步。
- worker bridge。
- 任务分发。
- 需要在 UI 隐藏 / 切换时仍然保持运行的无 UI 业务进程。

规则：

- runtime 不渲染业务 UI。
- runtime 只能由顶层 feature 的 `index.tsx` 挂载。
- subfeature 禁止拥有 runtime。
- `runtimes/index.tsx` 是 runtime 的公开聚合入口。
- runtime 默认自包含，不再拆 `use<Runtime>.ts` hook。
- 不应创建只被单个 runtime 使用的 `useFeedbackRuntime.ts`、`useSpectrumRuntime.ts` 这类 runtime hook。
- 如果 runtime 变复杂，优先拆同目录私有 runtime task 文件，例如 `SpectrumRuntimeTask.tsx`，而不是拆 `useRuntime` hook。
- 不在 `runtimes/` 内创建 `hooks/` 或 `utils/`。
- 只有当逻辑会被多个 runtime 复用，或确实是可独立测试的纯逻辑时，才允许提升到当前 FeatureUnit 同级的 `hooks/` 或 `utils/`。
- 如果逻辑生命周期和可见 subfeature 一致，放进 subfeature 的 `hooks/useXxx.ts` 或局部 component effect，而不是 runtime。
- 如果逻辑生命周期长于可见 subfeature，提升到顶层 feature `runtimes/`。

## `animations/`

`animations/` 存放动画定义。统一使用复数目录名。

可以被当前 Unit 的 view / parts / components 使用，但不能反向依赖业务 hook / store。

## Query 与 store 的边界

- 远程数据本体优先留在 TanStack Query。
- Zustand store 用于本地 UI 状态、草稿态、选择态、模式态。
- 不要为了“好拿到”就把 query 结果复制进 store。
- query result、query status、error state 默认不进 store。

适合放 query 的内容：

- 接口返回的数据。
- 请求状态。
- 缓存身份。

适合放 store 的内容：

- 当前选中项。
- 当前模式。
- 输入草稿。
- 本地开关。

## 判断口诀

- 可见独立业务能力：放 `subfeatures/`。
- 当前 Unit 的业务视图片段：放 `parts/`。
- 当前 Unit 拥有、被多个直接 child 复用的业务视图片段：放父级 `parts/`。
- 可复用无业务 UI：放 `components/`。
- recipe 跟随具体 UI owner；不要建 `recipes/` 目录。
- 当前 Unit 的生命周期 / 行为拆分：放 `hooks/useXxx.ts`。
- 跨 subfeature 生命周期的无 UI 进程：放顶层 `runtimes/`。
- runtime 默认自包含；不要为单个 runtime 拆 `useRuntime` hook。
- `use<Unit>.ts` 只做 composition，不直接写 effect / timer / listener。
- `index.tsx` 只做 public entry；`<Unit>.tsx` 内部调用 `use<Unit>()`。
- `<Unit>.tsx` 不直接 import `hooks/`；当前 Unit hook 组合通过 `use<Unit>.ts`。
- 顶层 store 创建 store；子级 store 只聚合 slice。
- 出现 `subfeatures/` 后，根 `<Unit>` 只做编排，不做大杂烩。

## 评审检查清单

- 是否把 feature-specific panel 放进了 `components/`？
- `components/` 是否 import 了当前 Unit 的 `parts/`、`store/`、`hooks/`、`utils/`？
- 是否创建了 `recipes/` 目录或把多个 UI owner 的 recipe 堆进一个 Unit recipe 文件？
- TSX 是否在拼接静态样式对象，而不是通过 recipe variant 表达？
- sibling subfeatures 是否互相 import？
- subfeature 是否错误拥有了 `runtimes/`？
- runtime 是否拆出了只被自己使用的 `useRuntime` hook？
- `use<Unit>.ts` 是否直接写了 `useEffect` / timer / listener / observer？
- `index.tsx` 是否调用了 `use<Unit>()` 或向 `<Unit />` 注入了 Unit model props？
- `<Unit>.tsx` 是否直接 import 了 `hooks/`，而不是通过 `use<Unit>.ts`？
- `<Unit>.tsx` 是否接收了由 `use<Unit>.ts` 生成的整体 model props，而不是自己调用 `use<Unit>()`？
- 是否预先创建了没有实际 slice / selector 的空 `store/`？
- 有 `store/` 的 Unit 是否都有 `store/index.ts`？
- 嵌套 Unit 的 `store/index.ts` 是否错误创建了新 store？
- 是否把 `store/index.ts` 误认为 leaf slice / selector 文件的替代品，并错误删除仍在使用的 leaf 文件？
- 出现 `subfeatures/` 后，根 `<Unit>.tsx` / `use<Unit>.ts` 是否仍在承载大杂烩业务逻辑？
- 是否把 query data / query status 复制进了 Zustand store？
- 某个 child subfeature 专属 part 是否错误放在父级 `parts/`？
- child subfeature 是否越级 import 了 grandparent `parts/`，或 import 了 sibling subfeature 的 `parts/`？
- 被 child subfeature 复用的父级 part 是否开始读 store、调用 query / mutation，或拥有业务流程状态？
