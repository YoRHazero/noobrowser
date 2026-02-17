import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useSaveFitResult } from "@/hooks/query/catalog/useSaveFitResult";
import { useDeleteFitJob } from "@/hooks/query/fit";
import { useFitStore } from "@/stores/fit";
import { useFitJobSelection } from "./useFitJobSelection";
import { useFitJobList } from "./useFitJobList";

export function useFitJobActions() {
    /* -------------------------------------------------------------------------- */
    /*                                Access Store                                */
    /* -------------------------------------------------------------------------- */
    const { tags, selectedTags, addTags, setSelectedTags } = useFitStore(
        useShallow((state) => ({
            tags: state.tags,
            selectedTags: state.selectedTags,
            addTags: state.addTags,
            setSelectedTags: state.setSelectedTags,
        })),
    );

    /* -------------------------------------------------------------------------- */
    /*                               Derived Values                               */
    /* -------------------------------------------------------------------------- */
    const { jobs } = useFitJobList();
    const { selectedJobId } = useFitJobSelection();

    const selectedJob = useMemo(() => {
        if (!selectedJobId) return null;
        return jobs.find((job) => job.job_id === selectedJobId) ?? null;
    }, [jobs, selectedJobId]);

    const status = selectedJob?.status ?? null;

    const canSave =
        !!selectedJobId && (status === "completed" || status === "saved");
    const canDelete = !!selectedJobId;

    /* -------------------------------------------------------------------------- */
    /*                              Mutations/Query                               */
    /* -------------------------------------------------------------------------- */
    const saveMutation = useSaveFitResult();
    const deleteMutation = useDeleteFitJob();

    /* -------------------------------------------------------------------------- */
    /*                                   Handle                                   */
    /* -------------------------------------------------------------------------- */
    const handleTagsChange = useCallback(
        (nextTags: string[]) => {
            // TagsInput component passes array of values directly
            setSelectedTags(nextTags);
            addTags(nextTags);
        },
        [addTags, setSelectedTags],
    );

    const handleSave = useCallback(async () => {
        if (!selectedJobId || !canSave) return;

        try {
            const response = await saveMutation.mutateAsync({
                jobId: selectedJobId,
                tags: selectedTags,
            });

            const responseTags = (response as { tags?: string[] } | null)?.tags;
            if (Array.isArray(responseTags)) {
                setSelectedTags(responseTags);
                addTags(responseTags);
            }

            toaster.success({
                title: "Fit Saved",
                description: `Job ${selectedJobId.slice(0, 8)} saved.`,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            toaster.error({
                title: "Fit Save Failed",
                description: message,
            });
        }
    }, [
        addTags,
        canSave,
        saveMutation,
        selectedJobId,
        selectedTags,
        setSelectedTags,
    ]);

    const handleDelete = useCallback(async () => {
        if (!selectedJobId || !canDelete) return;

        try {
            await deleteMutation.mutateAsync({ jobId: selectedJobId });
            toaster.success({
                title: "Fit Job Deleted",
                description: `Job ${selectedJobId.slice(0, 8)} deleted.`,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            toaster.error({
                title: "Delete Failed",
                description: message,
            });
        }
    }, [canDelete, deleteMutation, selectedJobId]);

    /* -------------------------------------------------------------------------- */
    /*                                   Return                                   */
    /* -------------------------------------------------------------------------- */
    return {
        tags,
        selectedJobId,
        status,
        selectedTags,
        canDelete,
        canSave,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,
        handleTagsChange,
        handleSave,
        handleDelete,
    };
}
