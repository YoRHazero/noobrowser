import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

gsap.registerPlugin(ScrollToPlugin);

interface ScrollFocusOptions {
	duration?: number;
	offset?: number;
	ease?: string;
	preventDefault?: boolean;
}

export function useScrollFocus<T extends HTMLElement>(
	keys: string,
	options: ScrollFocusOptions = {},
) {
	const elementRef = useRef<T>(null);

	const {
		duration = 1,
		offset = 0,
		ease = "power3.inOut",
		preventDefault = true,
	} = options;

	useHotkeys(
		keys,
		() => {
			if (elementRef.current) {
				gsap.to(window, {
					duration: duration,
					scrollTo: {
						y: elementRef.current,
						offsetY: offset,
						autoKill: true,
					},
					ease: ease,
				});
			}
		},
		{
			preventDefault: preventDefault,
			enableOnFormTags: true,
		},
		[duration, offset, ease],
	);

	return elementRef;
}
