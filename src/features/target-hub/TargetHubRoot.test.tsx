import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import {
	BEACON_DEFAULT_Y_RATIO,
	BEACON_EDGE_INSET,
	BEACON_EFFECT_ATTENTION_MS,
	BEACON_EFFECT_DURATION_MS,
} from "./shared/constants";
import { useTargetHubStore } from "./store";
import TargetHubRoot from "./TargetHubRoot";

const resetStore = () => {
	localStorage.clear();
	useTargetHubStore.setState({
		mode: "icon",
		dockVisible: false,
		reveal: "hidden",
		beaconYRatio: BEACON_DEFAULT_Y_RATIO,
		isDragging: false,
		dragStarted: false,
		effect: null,
		dockAnchorOffsetY: -44,
	});
};

const renderTargetHub = () =>
	render(
		<ChakraProvider>
			<TargetHubRoot />
		</ChakraProvider>,
	);

describe("TargetHubRoot", () => {
	beforeEach(() => {
		resetStore();
		Object.defineProperty(window, "matchMedia", {
			configurable: true,
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			writable: true,
			value: 1000,
		});
		vi.useFakeTimers();
	});

	afterEach(() => {
		act(() => {
			vi.runOnlyPendingTimers();
		});
		vi.useRealTimers();
	});

	it("updates reveal state from edge proximity", () => {
		renderTargetHub();

		fireEvent.pointerMove(window, { clientX: 80 });
		expect(useTargetHubStore.getState().reveal).toBe("peek");

		fireEvent.pointerMove(window, { clientX: 20 });
		expect(useTargetHubStore.getState().reveal).toBe("reveal");

		fireEvent.pointerMove(window, { clientX: 200 });
		act(() => {
			vi.advanceTimersByTime(170);
		});
		expect(useTargetHubStore.getState().reveal).toBe("hidden");
	});

	it("opens dock on click and renders mock content", () => {
		useTargetHubStore.setState({ reveal: "reveal" });
		renderTargetHub();

		fireEvent.click(screen.getByRole("button", { name: "Open Target Hub" }));

		expect(useTargetHubStore.getState().mode).toBe("dock");
		expect(screen.getByText("SRC-08A2")).toBeTruthy();
		expect(screen.getByText("Overview")).toBeTruthy();
		expect(screen.getByText("Analyzer")).toBeTruthy();
		expect(screen.getByText("Inspector")).toBeTruthy();
	});

	it("commits dragged beacon position on pointer up", () => {
		useTargetHubStore.setState({
			reveal: "reveal",
			beaconYRatio: 0.2,
		});
		renderTargetHub();

		const trigger = screen.getByRole("button", { name: "Open Target Hub" });
		fireEvent.pointerDown(trigger, { clientY: 200 });
		fireEvent.pointerMove(window, { clientY: 500 });
		fireEvent.pointerUp(window, { clientY: 500 });

		expect(useTargetHubStore.getState().beaconYRatio).toBeCloseTo(0.5, 2);
		expect(useTargetHubStore.getState().isDragging).toBe(false);
		expect(useTargetHubStore.getState().dragStarted).toBe(false);
	});

	it("collapses dock back to icon reveal", () => {
		useTargetHubStore.setState({
			mode: "dock",
			dockVisible: true,
			reveal: "hidden",
			beaconYRatio: BEACON_DEFAULT_Y_RATIO,
		});
		renderTargetHub();

		fireEvent.click(screen.getByRole("button", { name: /collapse/i }));
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(useTargetHubStore.getState().mode).toBe("icon");
		expect(useTargetHubStore.getState().reveal).toBe("reveal");
		expect(useTargetHubStore.getState().beaconYRatio).toBeGreaterThan(
			BEACON_EDGE_INSET / window.innerHeight,
		);
	});

	it("temporarily peeks the hidden beacon when an effect arrives", () => {
		useTargetHubStore.setState({
			mode: "icon",
			reveal: "hidden",
		});
		renderTargetHub();

		act(() => {
			useTargetHubStore.getState().emitEffect("source-ready", "#22d3ee");
		});
		expect(useTargetHubStore.getState().reveal).toBe("peek");
		expect(useTargetHubStore.getState().effect?.kind).toBe("source-ready");

		act(() => {
			vi.advanceTimersByTime(BEACON_EFFECT_DURATION_MS);
		});
		expect(useTargetHubStore.getState().effect).toBeNull();
		expect(useTargetHubStore.getState().reveal).toBe("peek");

		act(() => {
			vi.advanceTimersByTime(
				BEACON_EFFECT_ATTENTION_MS - BEACON_EFFECT_DURATION_MS,
			);
		});
		expect(useTargetHubStore.getState().reveal).toBe("hidden");
	});

	it("does not force beacon reveal changes while dragging", () => {
		useTargetHubStore.setState({
			mode: "icon",
			reveal: "reveal",
			isDragging: true,
		});
		renderTargetHub();

		act(() => {
			useTargetHubStore.getState().emitEffect("fit-ready", "#22d3ee");
		});

		expect(useTargetHubStore.getState().reveal).toBe("reveal");
		expect(useTargetHubStore.getState().effect?.kind).toBe("fit-ready");
	});
});
