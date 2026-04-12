export function getNedQueryErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return error == null ? null : "NED search failed.";
}
