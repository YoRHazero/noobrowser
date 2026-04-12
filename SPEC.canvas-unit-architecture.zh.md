# Canvas Unit 架构规范

## 目标

这份文档定义 `src/canvas/*` 下可复用 canvas / WebGL / Three.js 可视化单元的架构规则。

Canvas 渲染有自己的内部结构：场景基础设施、图层、可渲染对象、相机行为、指针解析和 hit test。这些概念不应该被强行塞进普通 feature component 的 `parts/` / `components/` 模型。

Canvas Unit 负责渲染机制。父 feature 负责业务数据组合。

## 与 Feature Unit 的关系

Canvas Unit 不是 Feature Unit。

Feature Unit 放在：

```text
src/features/<feature>/
```

Canvas Unit 放在：

```text
src/canvas/<canvasUnit>/
```

不要把可复用 Canvas Unit 放在：

```text
src/features/canvas/
```

因为 `canvas` 是渲染技术层，不是业务 feature。

## 命名

Canvas Unit 的目录名和根组件名建议以 `Canvas` 结尾。

例如：

```text
src/canvas/mapCanvas/
  MapCanvas.tsx
  useMapCanvas.ts
```

`Canvas` 后缀是刻意的架构信号：这个单元遵循 Canvas Unit 规则，而不是普通 Feature Component 规则。

## 标准结构

```text
src/canvas/<canvasUnit>/
  index.tsx
  api.ts
  <CanvasUnit>.tsx
  <CanvasUnit>.recipe.ts
  use<CanvasUnit>.ts

  shared/
    constants.ts
    types.ts

  core/
    CameraRig.tsx
    SceneEnvironment.tsx

  layers/
    FootprintsLayer.tsx
    SourcesLayer.tsx
    GraticuleLayer.tsx

  objects/
    FootprintMesh.tsx
    SourceMarker.tsx
    GraticuleLines.tsx

  overlays/
    CoordinateTooltip.tsx
    FootprintTooltip.tsx
    GraticuleTooltip.tsx

  hooks/
    useOverlayState.ts
    useTooltipViewModel.ts

  canvasHooks/
    useCameraFlight.ts
    usePointerResolver.ts
    useLayerHoverResolver.ts

  utils/
    index.ts
    projection.ts
    geometry.ts

  store/
    index.ts
    interactionSlice.ts
```

必需文件：

- `index.tsx`
- `api.ts`
- `<CanvasUnit>.tsx`
- `use<CanvasUnit>.ts`

可选文件 / 目录：

- `<CanvasUnit>.recipe.ts`
- `shared/`
- `core/`
- `layers/`
- `objects/`
- `overlays/`
- `hooks/`
- `canvasHooks/`
- `utils/`
- `store/`

不要预先创建空目录。

## Public Entry

`index.tsx` 是 Canvas Unit 的唯一公共 import 边界。

规则：

- `index.tsx` 只能直接导出或渲染 `<CanvasUnit />`。
- `index.tsx` 应该从 `api.ts` re-export 公共 API types。
- `index.tsx` 不能调用 `use<CanvasUnit>()`。
- `index.tsx` 不能创建、转换或注入 scene model。
- 外部调用方只能从 Canvas Unit public entry import。

允许：

```ts
import MapCanvas, {
  type MapCanvasActions,
  type MapCanvasModel,
} from "@/canvas/mapCanvas";
```

禁止：

```ts
import { FootprintsLayer } from "@/canvas/mapCanvas/layers/FootprintsLayer";
import type { MapCanvasModel } from "@/canvas/mapCanvas/api";
```

`api.ts` 定义公共契约，但外部调用方应该通过 `index.tsx` 获得这些契约。

## `api.ts`

`api.ts` 存放 Canvas Unit 的对外公共契约。

允许：

- `<CanvasUnit>Model`
- `<CanvasUnit>Actions`
- `<CanvasUnit>Model` 使用的 model item types
- `<CanvasUnit>Actions` 使用的 action parameter types
- model 或 actions 使用的公共 enum / union types

例如：

```ts
export interface MapCanvasModel {
  footprints: MapCanvasFootprintModel[];
  sources: MapCanvasSourceModel[];
  selectedFootprintId: string | null;
  showGrid: boolean;
  tooltipMode: MapCanvasTooltipMode;
  coordinatePrecision: number;
}

export interface MapCanvasActions {
  selectFootprint: (id: string | null) => void;
}

export interface MapCanvasFootprintModel {
  id: string;
  vertices: MapCanvasSkyCoordinate[];
  center: MapCanvasSkyCoordinate;
  files: string[];
}

export interface MapCanvasSourceModel {
  id: string;
  label?: string;
  coordinate: MapCanvasSkyCoordinate;
  color: string;
  visible: boolean;
}

export interface MapCanvasSkyCoordinate {
  ra: number;
  dec: number;
}

export interface MapCanvasScreenPoint {
  x: number;
  y: number;
}

export type MapCanvasTooltipMode = "footprint" | "coordinate";
```

规则：

- 任何出现在 `<CanvasUnit>Model` 或 `<CanvasUnit>Actions` 里的类型，必须在 `api.ts` 中定义或 re-export。
- `api.ts` 不能 import feature store。
- `api.ts` 不能 import query hook。
- `api.ts` 不能 import Canvas Unit private store types。
- `api.ts` 不应该暴露父级不需要知道的内部渲染类型。

## Props 边界

Canvas Unit 可以通过 props 接收业务数据，但只能通过类型化的 `model` 和 `actions` 对象接收。

允许：

```tsx
<MapCanvas model={mapCanvasModel} actions={mapCanvasActions} />
```

禁止：

```tsx
<MapCanvas
  footprints={footprints}
  sources={sources}
  selectedFootprintId={selectedFootprintId}
  showGrid={showGrid}
  tooltipMode={tooltipMode}
  coordinatePrecision={coordinatePrecision}
  onSelectFootprint={setSelectedFootprintId}
/>
```

不要传散落的业务 props。scene data 统一收敛到 `model`，事件 callback 统一收敛到 `actions`。

允许少量 identity / mounting config props，但它们不能是业务数据：

```tsx
<MapCanvas model={model} actions={actions} viewportRole="overview" />
```

除非配置项确实稳定且通用，否则避免增加 config props。

## 外部数据边界

Canvas Unit 禁止直接读取外部业务 store 或 query hook。

在 `src/canvas/<canvasUnit>/` 内禁止：

```ts
useSourceStore(...)
useGrismStore(...)
useOverviewStore(...)
useOverviewUiStore(...)
useQuery(...)
useGrismFootprints(...)
```

父 feature 负责业务数据组合。

例如：

```text
src/features/overview/useOverview.ts
  -> 读取 query hooks 和 stores
  -> 创建 MapCanvasModel 和 MapCanvasActions
  -> 把它们传给 <MapCanvas model={model} actions={actions} />
```

Canvas Unit 只负责渲染行为，不负责业务数据来源。

## Private Store

Canvas Unit 可以拥有私有 `store/`。

Canvas Unit 的 store 只能保存 canvas 内部渲染状态或交互状态，且生命周期必须被限制在 Canvas Unit 内。

允许：

```ts
cameraMode
currentZoomLevel
isDragging
hoveredObjectId
pointerAnchor
renderDebugEnabled
transientSelectionId
```

禁止：

```ts
sources
footprints
selectedFootprintId
activeSourceId
query result data
fit job state
overview sidebar state
```

规则：

- `store/` 是 Canvas Unit 私有实现细节。
- 只有 `src/canvas/<canvasUnit>/` 内部文件可以 import 自己的 `store/`。
- 父 feature 不能 import Canvas Unit store。
- 其它 Canvas Unit 不能 import 这个 store。
- 不允许把外部业务 store 的状态镜像进 Canvas Unit store。
- 不允许把 TanStack Query 数据复制进 Canvas Unit store。

## `shared/`

`shared/` 存放 Canvas Unit 内部共享定义。

允许：

```text
shared/
  constants.ts
  types.ts
```

`shared/types.ts` 是 Canvas Unit 内部类型文件，外部调用方不应该 import。

适合放：

- 内部坐标类型
- 内部 render object 类型
- layer 间共享但不对外暴露的类型
- 内部 geometry / projection 类型
- 必要时从 `api.ts` 派生的 alias

例如：

```ts
import type {
  MapCanvasScreenPoint,
  MapCanvasSkyCoordinate,
} from "../api";

export type SkyCoordinate = MapCanvasSkyCoordinate;
export type ScreenPoint = MapCanvasScreenPoint;

export interface CartesianCoordinate {
  x: number;
  y: number;
  z: number;
}
```

禁止：

- component props
- hook result types
- query response types
- 从 `src/features/*` 引入的 feature store types
- 未从 `api.ts` 导出的 public model/action contract types

## `utils/`

`utils/` 只放纯函数。

规则：

- 一个文件只承载一个工具职责。
- `index.ts` 统一 re-export public utilities。
- 不放 React hooks。
- 不读 store。
- 不调用 query。
- 不放模块级可变运行状态。
- 不定义 component props types。
- 不在 `utils/` 内定义业务 constants 或 types。
- utils 只能引用原生类型、必要的 `api.ts` 公共契约类型，以及 Canvas Unit 的 `shared/types.ts` / `shared/constants.ts`。

## `hooks/`

`hooks/` 放不依赖当前 Canvas renderer context 的 Canvas Unit 内部 hook。

允许：

- overlay state hook
- tooltip view-model hook
- 不依赖 renderer context 的 derived state hook
- 可以安全运行在 `<Canvas>` 外部的普通 React lifecycle hook

禁止：

- 调用任何依赖当前 Canvas renderer context 的 hook，包括 R3F 的 `useThree`、`useFrame`、`useLoader`、`useGraph` 等 renderer-specific hook
- import renderer context hook，例如从 `@react-three/fiber` import R3F context hook
- 读取外部业务 store
- 调用 query hook
- 调用 mutation hook
- import `src/features/*` 里的 feature hook
- app-level workflow orchestration
- 跨 feature 同步逻辑

Canvas Unit 内部 hooks 可以读取 Canvas Unit 私有 store。

Canvas Unit 内部 hooks 可以从 `use<CanvasUnit>.ts` 接收 scene model 的局部数据作为参数。

如果一个 hook 只有在组件挂载于 `<Canvas>` 内部时才能工作，它不能放在 `hooks/`，必须放在 `canvasHooks/`。

## `canvasHooks/`

`canvasHooks/` 放依赖当前 Canvas renderer context，或语义上绑定 Canvas 渲染生命周期的 hook。

允许：

- 需要 Canvas context 的 camera lifecycle hook
- 读取 `gl.domElement`、camera、viewport 或 renderer state 的 pointer event hook
- 使用 renderer camera / viewport / frame lifecycle 的 hit testing hook
- 需要 React 或 renderer lifecycle 的 projection / viewport hook
- RAF loop hook
- 绑定 Canvas render loop 的内部 animation state hook

规则：

- `canvasHooks/` 是 Canvas Unit 内唯一允许定义 renderer Canvas-context hook 的目录，例如 R3F 的 `useThree`、`useFrame`、`useLoader`、`useGraph`。
- `canvasHooks/` 内的 hook 只能被挂载在 `<Canvas>` 内部的组件调用，或被同一条 Canvas-internal 调用链上的 hook 调用。
- 当 `<CanvasUnit>.tsx` 在 `<Canvas>` 外部执行时，不能调用 `canvasHooks/` hook。
- 当 `use<CanvasUnit>.ts` 在 `<Canvas>` 外部执行时，不能调用 `canvasHooks/` hook。
- 如果 Canvas 内部状态需要展示在 `<Canvas>` 外部 overlay 中，应由 Canvas-internal 组件通过 callback 或 Canvas Unit 私有 store 向外发布状态。
- 同时被外层 overlay hook 和 `canvasHooks/` 使用的共享状态类型必须放在 `shared/types.ts`，不能定义在 `canvasHooks/` 内。

禁止：

- 读取外部业务 store
- 调用 query hook
- 调用 mutation hook
- import `src/features/*` 里的 feature hook
- 父 feature 业务编排

## `core/`

`core/` 存放场景基础设施。

允许：

```text
CameraRig.tsx
SceneEnvironment.tsx
RendererConfig.tsx
ControlsRig.tsx
```

规则：

- `core/` 不是业务图层。
- `core/` 可以使用 Canvas Unit `hooks/` 和 `canvasHooks/`。
- `core/` 可以接收由 scene model 推导出来的 props。
- `core/` 不能读取外部业务 store 或 query hook。
- `core/` 不能 import 父 feature 内部代码。

## `layers/`

`layers/` 存放 scene-level render layers。

允许：

```text
GlobeLayer.tsx
GraticuleLayer.tsx
FootprintsLayer.tsx
SourcesLayer.tsx
```

规则：

- layer 负责组合 objects。
- layer 通过 props 接收 `<CanvasUnit>.tsx` 传入的数据。
- layer 不能读取外部业务 store 或 query hook。
- layer 不能 import sibling layer。
- layer 可以 import objects、Canvas Unit `hooks/`、Canvas Unit `canvasHooks/`、Canvas Unit utils、Canvas Unit shared types/constants。
- layer 可以包含图层级渲染逻辑，但不应该承载宽泛的业务 workflow。

## `objects/`

`objects/` 存放底层可渲染对象。

允许：

```text
GlobeSphere.tsx
FootprintMesh.tsx
SourceMarker.tsx
GraticuleLines.tsx
```

规则：

- object 只能通过 props 接收数据。
- object 不能读 store。
- object 不能调用 query 或 mutation。
- object 不能 import 父 feature 代码。
- object 可以 import Canvas Unit 的 public API types、shared types/constants 和 utils。
- object 只能在“渲染行为本身需要”的情况下调用 `canvasHooks/` hook。
- object 不能直接定义或 import renderer Canvas-context hook，例如 R3F 的 `useThree` / `useFrame`；这类上下文绑定逻辑必须放在 `canvasHooks/`。
- object 应该保持为 Canvas Unit 内部可复用的低层渲染对象。

## `overlays/`

`overlays/` 存放由 Canvas Unit 拥有、渲染在 canvas surface 上方或周围的 DOM UI。

允许：

```text
CoordinateTooltip.tsx
FootprintTooltip.tsx
GraticuleTooltip.tsx
SelectionHud.tsx
```

规则：

- overlay 仍然属于 Canvas Unit，不属于父 feature UI。
- overlay 通过 `<CanvasUnit>.tsx` 或 `use<CanvasUnit>.ts` 传入的 props 接收 display-ready data。
- overlay view-model 推导应该放在 `use<CanvasUnit>.ts` 或 `hooks/`，不能写在 overlay TSX 中。
- 纯格式化、坐标转换、tooltip position math、截断 helper 应该放在 `utils/`，不能 inline 写在 `<CanvasUnit>.tsx`。
- overlay 需要的 DOM measurement，例如 container rect 读取，应该放在 `hooks/`，不能 inline 写在 `<CanvasUnit>.tsx`。
- overlay 不能读取外部业务 store 或 query hook。
- overlay 不能 import 父 feature 内部代码。
- overlay 不能调用 `canvasHooks/` 或任何 renderer Canvas-context hook。
- 如果 overlay 需要超出 root recipe 的静态 DOM/CSS 样式，可以按照同一套 recipe 规则拥有同级 recipe 文件。

## `<CanvasUnit>.tsx`

`<CanvasUnit>.tsx` 负责组织渲染树。

允许：

- 调用 `use<CanvasUnit>()`。
- 渲染 canvas root。
- 组装 `core/`、`layers/` 和 `overlays/`。
- 把 scene model 的局部数据和 actions 传给 layers / core。
- 使用 `<CanvasUnit>.recipe.ts` 管理自己直接拥有的 root layout 样式。

禁止：

- inline tooltip / overlay view-model 推导。
- inline coordinate formatting 或 tooltip positioning helper。
- inline overlay layout 需要的 DOM measurement，例如直接调用 `getBoundingClientRect()`。
- 直接调用外部业务 store。
- 直接调用 query hook。
- 实现父 feature 的业务 workflow。
- import 父 feature 内部代码。
- 变成大而全的业务 view model builder。

## `use<CanvasUnit>.ts`

`use<CanvasUnit>.ts` 从 props 和 canvas 内部状态组合 Canvas Unit 的 view model。

允许：

- 接收 `model` 和 `actions` props。
- 推导 layer props。
- 调用 Canvas Unit `hooks/` hook。
- 读取 Canvas Unit 私有 store。
- 准备传给 layers / objects 的 callback。

禁止：

- 当 `use<CanvasUnit>.ts` 在 `<Canvas>` 外部执行时，调用 `canvasHooks/` hook。
- 在 `<Canvas>` 外部直接或间接调用 renderer Canvas-context hook，例如 R3F 的 `useThree` / `useFrame`。
- 直接读取外部业务 store。
- 调用 query hook / mutation hook。
- 把 query result 复制进 Canvas Unit store。
- 承载父 feature 的业务编排。
- 直接写长生命周期逻辑；这类逻辑应该放到 Canvas Unit 内部 `hooks/` 或 `canvasHooks/`。

## Recipe

Canvas Unit 遵循和 Feature Unit 相同的 recipe 规则。

规则：

- 不允许创建 `recipes/` 目录。
- `<CanvasUnit>.tsx` 可以使用同级 `<CanvasUnit>.recipe.ts`。
- layer 或 object 如果需要显著的静态 DOM/CSS 样式，可以拥有同级 recipe。
- 纯 Three.js material / geometry 数值不需要强行做 recipe。
- TSX 可以传入坐标、transform、material color、CSS variable 等运行时渲染数据。
- 静态 DOM/CSS 视觉规则应进入 recipe。

## 父 Feature 集成方式

父 feature 通过创建 `model` 和 `actions` 集成 Canvas Unit。

例如：

```text
src/features/overview/
  useOverview.ts
  Overview.tsx
```

```tsx
<MapCanvas model={mapCanvasModel} actions={mapCanvasActions} />
```

规则：

- 父 feature 负责业务 query/store 组合。
- 父 feature 不能 import Canvas Unit 内部文件。
- Canvas Unit 不能 import 父 feature 内部文件。
- 双方只能通过 `model` 和 `actions` props 通信。

## 旧概念迁移规则

不要把已经过期的业务命名带进新的 Canvas Unit。

例如：

- 如果真实对象已经是 `Source`，使用 `SourceMarker` / `SourcesLayer`，不要继续使用 `ManualTargetMarker`。
- 如果概念只是 overview-local draft marker，使用 `DraftMarker`，不要继续使用 `ManualTarget`。
- 如果概念是 cursor coordinate preview，使用 `CursorCoordinateMarker`，不要继续使用 `DraftTarget`。

## Review Checklist

- 这个单元是否位于 `src/canvas/<canvasUnit>/`，而不是 `src/features/canvas/`？
- 目录名和根组件名是否以 `Canvas` 结尾？
- `index.tsx` 是否只暴露 public entry 并 re-export API types？
- public model/action types 是否定义在 `api.ts`？
- 业务数据和 callback 是否被收敛到 `model` 和 `actions` props？
- Canvas Unit 是否避免直接 import feature store、global business store、query hook、parent feature hook？
- Canvas Unit store 是否是私有的，并且只保存渲染/交互状态？
- constants 和内部 types 是否放在 `shared/`，而不是 `utils/`？
- public contract types 是否放在 `api.ts`，而不是只放在 `shared/types.ts`？
- renderer Canvas-context hook 是否全部隔离在 `canvasHooks/`？
- `hooks/` 是否避免了 renderer Canvas-context hook，包括 R3F 的 `useThree`、`useFrame`、`useLoader`、`useGraph`？
- 外层 `use<CanvasUnit>.ts` 在 `<Canvas>` 外运行时是否避免调用 `canvasHooks/`？
- utils 是否是纯函数，并通过 `utils/index.ts` 导出？
- 场景基础设施是否放在 `core/`？
- scene-level composition 是否放在 `layers/`？
- 低层可渲染对象是否放在 `objects/`？
- canvas-owned DOM overlays 是否放在 `overlays/`，而不是 inline 写在 `<CanvasUnit>.tsx`？
- overlay view-model 推导是否放在 `use<CanvasUnit>.ts` 或 `hooks/`？
- 格式化和 tooltip positioning helper 是否放在 `utils/`，而不是 inline 写在 `<CanvasUnit>.tsx`？
- overlay layout 需要的 DOM measurement 是否放在 `hooks/`，而不是 inline 写在 `<CanvasUnit>.tsx`？
- layers 是否避免 import sibling layers？
- objects 是否避免读 store 或调用 query？
- `<CanvasUnit>.tsx` 是否在内部调用 `use<CanvasUnit>()`？
- `use<CanvasUnit>.ts` 是否避免业务 store/query 读取？
- 是否避免在概念变化后继续沿用旧业务命名？
