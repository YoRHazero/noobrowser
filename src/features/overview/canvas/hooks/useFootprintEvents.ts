export function useFootprintEvents() {
	return {
		onSelectFootprint: (_footprintId: string | null) => undefined,
		onHoverFootprint: (_footprintId: string | null) => undefined,
	};
}
