export function mapNedSearchResults(
	results: Array<{
		object_name: string;
		ra: number;
		dec: number;
		redshift: number | null;
		url: string;
	}>,
) {
	return results.map((result) => ({
		objectName: result.object_name,
		ra: result.ra,
		dec: result.dec,
		redshift: result.redshift,
		url: result.url,
	}));
}
