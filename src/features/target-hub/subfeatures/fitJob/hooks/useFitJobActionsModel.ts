"use client";

import { useCallback, useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useSaveFitResult } from "@/hooks/query/catalog";
import { useDeleteFitJob } from "@/hooks/query/fit";
import type { FitJobActionsModel, FitJobStatus } from "../shared/types";

function toMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

type UseFitJobActionsModelParams = {
	selectedJobId: string | null;
	status: FitJobStatus | null;
	onClearSelectedJob: () => void;
};

export function useFitJobActionsModel({
	selectedJobId,
	status,
	onClearSelectedJob,
}: UseFitJobActionsModelParams): FitJobActionsModel {
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		if (selectedJobId === null) {
			setSelectedTags([]);
			return;
		}

		setSelectedTags([]);
	}, [selectedJobId]);

	const saveMutation = useSaveFitResult();
	const deleteMutation = useDeleteFitJob();

	const canSave =
		selectedJobId !== null && (status === "completed" || status === "saved");
	const canDelete = selectedJobId !== null;

	const onTagsChange = useCallback((tags: string[]) => {
		setSelectedTags(tags);
	}, []);

	const onSave = useCallback(async () => {
		if (!selectedJobId || !canSave) {
			return;
		}

		try {
			await saveMutation.mutateAsync({
				jobId: selectedJobId,
				tags: selectedTags,
			});
			toaster.success({
				title: "Fit result saved",
				description: `Job ${selectedJobId.slice(0, 8)} saved to the catalog.`,
			});
		} catch (error) {
			toaster.error({
				title: "Save failed",
				description: toMessage(error),
			});
		}
	}, [canSave, saveMutation, selectedJobId, selectedTags]);

	const onDelete = useCallback(async () => {
		if (!selectedJobId || !canDelete) {
			return;
		}

		try {
			await deleteMutation.mutateAsync({ jobId: selectedJobId });
			onClearSelectedJob();
			setSelectedTags([]);
			toaster.success({
				title: "Fit job deleted",
				description: `Job ${selectedJobId.slice(0, 8)} was removed.`,
			});
		} catch (error) {
			toaster.error({
				title: "Delete failed",
				description: toMessage(error),
			});
		}
	}, [canDelete, deleteMutation, onClearSelectedJob, selectedJobId]);

	return {
		selectedTags,
		canSave,
		canDelete,
		isSaving: saveMutation.isPending,
		isDeleting: deleteMutation.isPending,
		onTagsChange,
		onSave,
		onDelete,
	};
}
