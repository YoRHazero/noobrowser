import { beforeEach, describe, expect, it } from "vitest";
import {
	BEACON_DEFAULT_Y_RATIO,
	TARGET_HUB_STORAGE_KEY,
} from "../shared/constants";
import { useTargetHubStore } from ".";

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

describe("target hub store", () => {
	beforeEach(() => {
		resetStore();
	});

	it("switches mode between icon and dock", () => {
		useTargetHubStore.getState().openDock();
		expect(useTargetHubStore.getState().mode).toBe("dock");
		expect(useTargetHubStore.getState().dockVisible).toBe(true);

		useTargetHubStore.getState().collapseToIcon();
		expect(useTargetHubStore.getState().mode).toBe("icon");
		expect(useTargetHubStore.getState().dockVisible).toBe(false);
		expect(useTargetHubStore.getState().reveal).toBe("reveal");
	});

	it("clamps beacon ratio updates", () => {
		useTargetHubStore.getState().updateBeaconYRatio(1.5);
		expect(useTargetHubStore.getState().beaconYRatio).toBe(1);

		useTargetHubStore.getState().updateBeaconYRatio(-0.25);
		expect(useTargetHubStore.getState().beaconYRatio).toBe(0);
	});

	it("persists only mode and beacon ratio", () => {
		useTargetHubStore.getState().openDock();
		useTargetHubStore.getState().updateBeaconYRatio(0.72);
		useTargetHubStore.getState().setReveal("peek");
		useTargetHubStore.getState().emitEffect("source-ready", "#22d3ee");

		const raw = localStorage.getItem(TARGET_HUB_STORAGE_KEY);
		expect(raw).not.toBeNull();

		const parsed = JSON.parse(raw ?? "{}");
		expect(parsed.state.mode).toBe("dock");
		expect(parsed.state.beaconYRatio).toBe(0.72);
		expect(parsed.state.reveal).toBeUndefined();
		expect(parsed.state.effect).toBeUndefined();
	});

	it("increments effect token for repeated effect kinds", () => {
		useTargetHubStore.getState().emitEffect("source-ready", "#22d3ee");
		const firstToken = useTargetHubStore.getState().effect?.token;

		useTargetHubStore.getState().emitEffect("source-ready", "#22d3ee");
		const secondToken = useTargetHubStore.getState().effect?.token;

		expect(firstToken).toBe(1);
		expect(secondToken).toBe(2);
	});

	it("clears the shared effect without touching persisted fields", () => {
		useTargetHubStore.getState().openDock();
		useTargetHubStore.getState().updateBeaconYRatio(0.61);
		useTargetHubStore.getState().emitEffect("fit-ready", "#22d3ee");

		expect(useTargetHubStore.getState().effect?.kind).toBe("fit-ready");

		useTargetHubStore.getState().clearEffect();

		expect(useTargetHubStore.getState().effect).toBeNull();
		expect(useTargetHubStore.getState().mode).toBe("dock");
		expect(useTargetHubStore.getState().beaconYRatio).toBe(0.61);
	});
});
