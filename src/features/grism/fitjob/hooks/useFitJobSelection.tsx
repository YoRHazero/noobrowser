import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { ReactNode } from "react";

type FitJobSelectionContextValue = {
	selectedJobId: string | null;
	selectJob: (jobId: string) => void;
	clearSelection: () => void;
};

const FitJobSelectionContext = createContext<FitJobSelectionContextValue | null>(
	null,
);

export function FitJobSelectionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

	const selectJob = useCallback((jobId: string) => {
		setSelectedJobId((prev) => (prev === jobId ? null : jobId));
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedJobId(null);
	}, []);

	const value = useMemo(
		() => ({ selectedJobId, selectJob, clearSelection }),
		[selectedJobId, selectJob, clearSelection],
	);

	return (
		<FitJobSelectionContext.Provider value={value}>
			{children}
		</FitJobSelectionContext.Provider>
	);
}

export function useFitJobSelection() {
	const context = useContext(FitJobSelectionContext);
	if (!context) {
		throw new Error(
			"useFitJobSelection must be used within FitJobSelectionProvider",
		);
	}
	return context;
}
