import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { vehicleListParser, type TruncatedSolo } from "@utils/parsers/vehicleListParser";
import testDataDump from "@assets/testDataDump.json";
import dummyVehicleActivity from "@assets/dummyVehicleActivity.json"

const parsedTestDataDump = vehicleListParser.safeParse(testDataDump);

if (!parsedTestDataDump.success) {
	throw new Error("failed to parse vehicle data");
}

const { vehicle_list: vehicles } = parsedTestDataDump.data

export const getVehicles = {
	getAll: defineAction({
		input: z.object({
			full: z.boolean(),
			length: z.number().default(100),
			offset: z.number().default(0)
		}),
		handler(input, context) {
			const { length, offset, full } = input

			try {


				if (full) return vehicles

				return vehicles.slice(offset, length)

			} catch (error) {

				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `${error}`
				})
			}
		},
	}),
	getTruncatedAll: defineAction({
		handler(input, context) {

			const remapped = vehicles.map(x => {
				const truncated: TruncatedSolo = { ...x }
				return truncated
			})

			return remapped

		},
	}),
	getIndividual: defineAction({
		input: z.object({
			vin: z.string()
		}),
		handler(input, context) {
			const { vin } = input

			const foundVehicle = vehicles.find(x => x.VIN === vin)

			if (foundVehicle) {
				return foundVehicle
			} else {
				throw new ActionError({
					code: "NOT_FOUND",
					message: "could not find vehicle with that vin"
				})
			}

		},
	}),
	getVehicleActivity: defineAction({
		//input: z.object({
		//	vin: z.string()
		//}),
		handler(_, context) {
			return dummyVehicleActivity
		},
	})
}
