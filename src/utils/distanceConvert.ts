export const kmsToMiles = (kms: number | undefined) => {
	if (kms) {
		return (kms * 2) / 3
	}
}
