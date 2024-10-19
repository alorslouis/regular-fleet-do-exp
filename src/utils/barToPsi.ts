import { z } from "zod"

type Bar = number | null | undefined

const numberParser = z.number()

export function transformBarToPsi(bar: Bar) {
	if (bar) {
		return Math.round(bar * 14.5038);
	} else {
		throw new Error("NaN!")
	}
}

export function transformMultiBarToPSI(pressures: Bar[] | undefined) {

	if (!pressures) {
		throw new Error("nonono")
	}

	const ins = pressures.map(x => transformBarToPsi(x))

	return ins.reduce((acc, currentVal) => acc + currentVal, 0) / ins?.length


}
