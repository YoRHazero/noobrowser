import { extend, useApplication } from "@pixi/react";
import type { Application } from "pixi.js";
import { Viewport as BaseViewport, type IViewportOptions } from "pixi-viewport";
import type { PropsWithChildren } from "react";

type ViewportProps = Omit<IViewportOptions, "events">;

export class ViewportWrapper extends BaseViewport {
	constructor(options: ViewportProps & { app: Application }) {
		const { app, ...rest } = options;
		super({
			...rest,
			// events is the only required argument to the constructor.
			// This may be why extend() doesn't work propertly with pixi-viewport.
			// other pixi elements have no required arguments to the constructor.
			// hence we need to pass the app to the constructor.
			events: app.renderer.events,
		});
		this.drag().pinch().wheel().decelerate();
	}
}

extend({ ViewportWrapper });

export default function Viewport(props: PropsWithChildren<ViewportProps>) {
	const { children, ...rest } = props;
	const { app } = useApplication();

	return (
		app?.renderer && (
			<pixiViewportWrapper app={app} {...rest}>
				{children}
			</pixiViewportWrapper>
		)
	);
}
