import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { vehicleListParser } from "@utils/parsers/vehicleListParser";
import testDataDump from "@assets/testDataDump.json";
import dummyVehicleActivity from "@assets/dummyVehicleActivity.json"

const parsedTestDataDump = vehicleListParser.safeParse(testDataDump);

if (!parsedTestDataDump.success) {
	throw new Error("failed to parse vehicle data");
}

const { vehicle_list } = parsedTestDataDump.data

export const getVehicles = {
	getAll: defineAction({
		input: z.object({
			length: z.number().default(100),
			offset: z.number().default(0)
		}),
		handler(input, context) {
			const { length, offset } = input

			try {
				return vehicle_list.slice(offset, length)

			} catch (error) {

				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `${error}`
				})
			}
		},
	}),
	getIndividual: defineAction({
		input: z.object({
			vin: z.string()
		}),
		handler(input, context) {
			const { vin } = input

			const foundVehicle = vehicle_list.find(x => x.VIN === vin)

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