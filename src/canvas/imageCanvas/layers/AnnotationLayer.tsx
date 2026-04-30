import type { Rect } from "../api";
import { AnnotationHitPlane } from "../objects/AnnotationHitPlane";
import { CollapseWindowGizmo } from "../objects/CollapseWindowGizmo";
import { RectOutline } from "../objects/RectOutline";
import { SourceMarker } from "../objects/SourceMarker";
import { TraceLine } from "../objects/TraceLine";
import {
	IMAGE_CANVAS_ACTIVE_TRACE_WIDTH,
	IMAGE_CANVAS_ROI_OUTLINE_COLOR,
} from "../shared/constants";
import type {
	ImageCanvasViewKind,
	ResolvedImageCanvasViewModel,
} from "../shared/types";

function RoiOutline({ roi }: { roi: Rect | null }) {
	if (!roi) {
		return null;
	}

	return (
		<RectOutline
			rect={roi}
			color={IMAGE_CANVAS_ROI_OUTLINE_COLOR}
			lineWidth={2}
			z={8}
		/>
	);
}

export function AnnotationLayer({
	view,
	viewKind,
}: {
	view: ResolvedImageCanvasViewModel;
	viewKind: ImageCanvasViewKind;
}) {
	const visibleSources = view.sources.filter(
		(source) => source.visible !== false,
	);
	const showRoi = viewKind === "main";
	const showCollapseWindow =
		viewKind === "roi" && view.roi !== null && view.collapseWindow !== null;

	return (
		<group>
			<AnnotationHitPlane view={view} />
			{showRoi ? <RoiOutline roi={view.roi} /> : null}
			{visibleSources.map((source) => (
				<TraceLine
					key={`${source.id}:trace`}
					source={{
						...source,
						trace: source.trace
							? {
									...source.trace,
									width: source.active
										? (source.trace.width ?? IMAGE_CANVAS_ACTIVE_TRACE_WIDTH)
										: source.trace.width,
								}
							: undefined,
					}}
					view={view}
					z={6}
				/>
			))}
			{visibleSources.map((source) => (
				<SourceMarker
					key={`${source.id}:marker`}
					source={source}
					view={view}
					z={7}
				/>
			))}
			{showCollapseWindow ? (
				<CollapseWindowGizmo
					roi={view.roi as Rect}
					collapseWindow={view.collapseWindow as Rect}
					onChange={view.onCollapseWindowChange}
				/>
			) : null}
		</group>
	);
}
