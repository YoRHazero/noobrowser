import {
    usePlotCacheComparison,
    usePlotCachePosterior,
    usePlotCacheSpectrum,
    usePlotCacheTrace,
} from "@/hooks/query/plot";
import { usePlotBlobUrls } from "./usePlotBlobUrls";
import type { PlotState } from "../types";

type UseFitJobVisualsProps = {
    jobId: string;
    selectedModelName: string | null;
    isCompleted: boolean;
    bestModelName?: string | null;
};

export function useFitJobVisuals({
    jobId,
    selectedModelName,
    isCompleted,
    bestModelName,
}: UseFitJobVisualsProps) {
    /* -------------------------------------------------------------------------- */
    /*                              Mutations/Query                               */
    /* -------------------------------------------------------------------------- */
    // If selected model is the best model, we don't send model_name param to backend
    // (assuming backend defaults to best model, or we want to leverage cache for default)
    // Actually, let's keep logic consistent with previous implementation:
    // if selected == best, param is null? Or just always pass selected?
    // Previous logic:
    // const modelNameParam = selectedModelName && summaryQuery.data?.best_model_name &&
    //     selectedModelName === summaryQuery.data.best_model_name ? null : selectedModelName;

    const modelNameParam =
        selectedModelName &&
        bestModelName &&
        selectedModelName === bestModelName
            ? null
            : selectedModelName;

    const comparisonQuery = usePlotCacheComparison({
        jobId,
        enabled: isCompleted,
    });

    const spectrumQuery = usePlotCacheSpectrum({
        jobId,
        enabled: isCompleted,
        model_name: modelNameParam,
    });

    const posteriorQuery = usePlotCachePosterior({
        jobId,
        enabled: isCompleted,
        model_name: modelNameParam,
    });

    const traceQuery = usePlotCacheTrace({
        jobId,
        enabled: isCompleted,
        model_name: modelNameParam,
    });

    /* -------------------------------------------------------------------------- */
    /*                               Derived Values                               */
    /* -------------------------------------------------------------------------- */
    const plotUrls = usePlotBlobUrls({
        comparison: comparisonQuery.data ?? null,
        spectrum: spectrumQuery.data ?? null,
        posterior: posteriorQuery.data ?? null,
        trace: traceQuery.data ?? null,
    });

    const plots: PlotState[] = [
        {
            kind: "comparison",
            title: "Model Comparison",
            url: plotUrls.comparisonUrl,
            isLoading: comparisonQuery.isFetching,
            error: comparisonQuery.isError
                ? comparisonQuery.error instanceof Error
                    ? comparisonQuery.error.message
                    : String(comparisonQuery.error)
                : null,
        },
        {
            kind: "spectrum",
            title: "Spectrum",
            url: plotUrls.spectrumUrl,
            isLoading: spectrumQuery.isFetching,
            error: spectrumQuery.isError
                ? spectrumQuery.error instanceof Error
                    ? spectrumQuery.error.message
                    : String(spectrumQuery.error)
                : null,
        },
        {
            kind: "posterior",
            title: "Posterior",
            url: plotUrls.posteriorUrl,
            isLoading: posteriorQuery.isFetching,
            error: posteriorQuery.isError
                ? posteriorQuery.error instanceof Error
                    ? posteriorQuery.error.message
                    : String(posteriorQuery.error)
                : null,
        },
        {
            kind: "trace",
            title: "Trace",
            url: plotUrls.traceUrl,
            isLoading: traceQuery.isFetching,
            error: traceQuery.isError
                ? traceQuery.error instanceof Error
                    ? traceQuery.error.message
                    : String(traceQuery.error)
                : null,
        },
    ];

    /* -------------------------------------------------------------------------- */
    /*                                   Return                                   */
    /* -------------------------------------------------------------------------- */
    return {
        plots,
    };
}
