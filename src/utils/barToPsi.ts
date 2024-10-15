type Bar = number | null | undefined

export function transformBarToPsi(bar: Bar) {
	if (bar) return Math.round(bar * 14.5038);
}

export function transformMultiBarToPist(pressures: Bar[]) {

	const length = pressures?.length

	const y = pressures.map(x => transformBarToPsi(x)).filter(x => !!x)

}
