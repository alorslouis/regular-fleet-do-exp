import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { getVehicles } from './getVehicles';

export const server = {
	getVehicles
}
