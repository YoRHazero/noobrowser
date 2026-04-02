import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import type { BeaconEffect } from "../../shared/types";
import { DockSessionCard } from "./DockSessionCard";

const baseProps = {
	label: "SRC-08A2",
	status: "READY",
	color: "#22d3ee",
	cardCss: {},
	dotCss: {},
	statusCss: {},
	feedbackCss: {},
	noticeCss: {},
};

const renderCard = (effect: BeaconEffect | null) =>
	render(
		<ChakraProvider>
			<DockSessionCard {...baseProps} effect={effect} />
		</ChakraProvider>,
	);

describe("DockSessionCard", () => {
	beforeEach(() => {
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
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders without feedback when effect is null", () => {
		renderCard(null);

		expect(screen.queryByTestId("dock-feedback-layer")).toBeNull();
		expect(screen.queryByTestId("dock-status-notice")).toBeNull();
	});

	it("renders source-ready feedback with sweep, dot pulse, and notice", () => {
		renderCard({
			token: 1,
			kind: "source-ready",
			color: "#22d3ee",
		});

		expect(screen.getByTestId("dock-feedback-sweep")).toBeTruthy();
		expect(screen.getByTestId("dock-feedback-dot-primary")).toBeTruthy();
		expect(screen.queryByTestId("dock-feedback-dot-secondary")).toBeNull();
		expect(screen.getByText("Spectrum Ready")).toBeTruthy();
	});

	it("renders fit-ready feedback with double dot pulse and card glow", () => {
		renderCard({
			token: 2,
			kind: "fit-ready",
			color: "#22d3ee",
		});

		expect(screen.getByTestId("dock-feedback-card-glow")).toBeTruthy();
		expect(screen.getByTestId("dock-feedback-dot-primary")).toBeTruthy();
		expect(screen.getByTestId("dock-feedback-dot-secondary")).toBeTruthy();
		expect(screen.getByText("Fit Ready")).toBeTruthy();
	});

	it("renders source-error feedback with rim flash and notice", () => {
		renderCard({
			token: 3,
			kind: "source-error",
			color: "#22d3ee",
		});

		expect(screen.getByTestId("dock-feedback-rim")).toBeTruthy();
		expect(screen.getByText("Source Error")).toBeTruthy();
	});

	it("replays feedback when the effect token changes", () => {
		const { rerender } = renderCard({
			token: 4,
			kind: "active-switch",
			color: "#22d3ee",
		});

		expect(
			screen
				.getByTestId("dock-status-notice")
				.getAttribute("data-effect-token"),
		).toBe("4");

		rerender(
			<ChakraProvider>
				<DockSessionCard
					{...baseProps}
					effect={{
						token: 5,
						kind: "active-switch",
						color: "#22d3ee",
					}}
				/>
			</ChakraProvider>,
		);

		expect(
			screen
				.getByTestId("dock-status-notice")
				.getAttribute("data-effect-token"),
		).toBe("5");
		expect(screen.getByText("Source Updated")).toBeTruthy();
	});
});
