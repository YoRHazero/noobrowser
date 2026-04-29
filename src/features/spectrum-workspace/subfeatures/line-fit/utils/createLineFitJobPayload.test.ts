import { describe, expect, it } from "vitest";
import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";
import type { Source } from "@/stores/source";
import { createLineFitJobBody } from "./createLineFitJobBody";
import { createLineFitJobConfigurations } from "./createLineFitJobConfigurations";

function createGaussianModel(
	patch: Partial<Extract<Spectrum1DCanvasFitModel, { kind: "gaussian" }>> = {},
): Extract<Spectrum1DCanvasFitModel, { kind: "gaussian" }> {
	return {
		id: 1,
		kind: "gaussian",
		label: "Gaussian 1",
		active: true,
		subtractFromSlice: false,
		color: "#ff0000",
		range: { minUm: 3, maxUm: 1 },
		amplitude: 5,
		muUm: 2,
		sigmaUm: 0.1,
		...patch,
	};
}

function createLinearModel(
	patch: Partial<Extract<Spectrum1DCanvasFitModel, { kind: "linear" }>> = {},
): Extract<Spectrum1DCanvasFitModel, { kind: "linear" }> {
	return {
		id: 2,
		kind: "linear",
		label: "Linear 1",
		active: false,
		subtractFromSlice: true,
		color: "#00ff00",
		range: { minUm: 1, maxUm: 3 },
		k: 0.5,
		b: 1.5,
		x0Um: 2,
		...patch,
	};
}

function createSource(patch: Partial<Source> = {}): Source {
	return {
		id: "src-1",
		label: "Source 1",
		color: "#ffffff",
		createdAt: "2026-04-30T00:00:00.000Z",
		position: {
			ra: 10,
			dec: 20,
			x: 30,
			y: 40,
		},
		imageRef: {
			refBasename: "ref-a",
			footprintId: "12",
		},
		z: 1.2,
		visibility: {
			overview: true,
			inspector: true,
		},
		spectrum: {
			status: "ready",
			extractionParams: {
				apertureSize: 5,
				waveMinUm: 4,
				waveMaxUm: 1,
			},
		},
		...patch,
	};
}

describe("line fit job payload", () => {
	it("maps canvas fit models and priors to the backend fit model contract", () => {
		const [configuration] = createLineFitJobConfigurations(
			[
				{
					id: "config-1",
					name: "single gaussian",
					models: [createGaussianModel(), createLinearModel()],
					priorsByModelId: {
						1: {
							sigma: {
								type: "TruncatedNormal",
								mu: 0.1,
								sigma: 0.02,
								lower: 0.05,
								upper: 0.2,
							},
						},
						2: {
							k: {
								type: "Normal",
								mu: 0.5,
								sigma: 0.1,
							},
						},
					},
				},
			],
			["config-1"],
		);

		expect(configuration).toEqual({
			model_name: "single gaussian",
			models: [
				{
					id: 1,
					kind: "gaussian",
					name: "Gaussian 1",
					active: true,
					subtracted: false,
					range: { min: 1, max: 3 },
					color: "#ff0000",
					amplitude: 5,
					mu: 2,
					sigma: 0.1,
					priors: {
						sigma: {
							type: "TruncatedNormal",
							mu: 0.1,
							sigma: 0.02,
							lower: 0.05,
							upper: 0.2,
						},
					},
				},
				{
					id: 2,
					kind: "linear",
					name: "Linear 1",
					active: false,
					subtracted: true,
					range: { min: 1, max: 3 },
					color: "#00ff00",
					k: 0.5,
					b: 1.5,
					x0: 2,
					priors: {
						k: {
							type: "Normal",
							mu: 0.5,
							sigma: 0.1,
						},
					},
				},
			],
		});
	});

	it("keeps selected configurations in input order and makes duplicate names unique", () => {
		const configurations = createLineFitJobConfigurations(
			[
				{
					id: "newest",
					name: "duplicate",
					models: [createGaussianModel({ id: 3 })],
				},
				{
					id: "middle",
					name: "duplicate",
					models: [createGaussianModel({ id: 2 })],
				},
				{
					id: "oldest",
					name: "unselected",
					models: [createGaussianModel({ id: 1 })],
				},
			],
			["middle", "newest"],
		);

		expect(
			configurations.map((configuration) => configuration.model_name),
		).toEqual(["duplicate", "duplicate (2)"]);
		expect(
			configurations.map((configuration) => configuration.models[0]?.id),
		).toEqual([3, 2]);
	});

	it("builds the fit body from source metadata and extraction params", () => {
		const fit = createLineFitJobConfigurations(
			[
				{
					id: "config-1",
					name: "single gaussian",
					models: [createGaussianModel()],
				},
			],
			["config-1"],
		);
		const body = createLineFitJobBody({
			source: createSource(),
			fit,
		});

		expect(body).toMatchObject({
			extraction: {
				extraction_config: {
					aperture_size: 5,
					wavelength_range: {
						min: 1,
						max: 4,
					},
				},
				source_meta: {
					source_id: "src-1",
					ra: 10,
					dec: 20,
					x: 30,
					y: 40,
					ref_basename: "ref-a",
					group_id: 12,
					z: 1.2,
				},
			},
			fit,
		});
	});

	it("does not build a body without extraction params or fit configurations", () => {
		expect(
			createLineFitJobBody({
				source: createSource({
					spectrum: {
						status: "idle",
						extractionParams: null,
					},
				}),
				fit: [
					{
						model_name: "single gaussian",
						models: [],
					},
				],
			}),
		).toBeNull();

		expect(
			createLineFitJobBody({
				source: createSource(),
				fit: [],
			}),
		).toBeNull();
	});
});
