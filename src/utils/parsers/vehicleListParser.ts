import { z } from "zod"

const vehicleListing = z.object({ monitor_id: z.number().nullish(), VIN: z.string().nullish(), user_id: z.number().nullish(), identification: z.string().nullish(), name: z.string().nullish(), lat: z.number().nullish(), lon: z.number().nullish(), odometer: z.number().nullish(), last_complete_dataset_date: z.number().nullish(), speed: z.number().nullish(), locked: z.boolean().nullish(), shift_state: z.string().nullish(), in_service: z.boolean().nullish(), rated_range_km: z.number().nullish(), rated_range: z.any().nullish(), prefers_kilometers: z.boolean().nullish(), range_decimal: z.number().nullish(), car_image_url: z.any().nullish(), car_image_path: z.string().nullish(), autocharge: z.any().nullish(), active_high_priority_service_alert_count: z.number().nullish(), active_medium_priority_service_alert_count: z.number().nullish(), active_other_priority_service_alert_count: z.number().nullish(), active_service_alert_count: z.number().nullish(), status_text: z.string().nullish(), location_text: z.string().nullish(), street_location: z.string().nullish(), mobile_access_enabled: z.boolean().nullish(), mobile_access_date: z.any().nullish(), last_online_date: z.any().nullish(), inside_temperature: z.number().nullish(), outside_temperature: z.number().nullish(), driver_temperature_setting: z.number().nullish(), is_climate_enabled: z.boolean().nullish(), temperature_units: z.string().nullish(), user_access_type: z.string().nullish(), can_obtain_owner_level_access: z.boolean().nullish(), has_access_provisioning_access: z.boolean().nullish(), access_provisioning_data: z.any().nullish(), activity_log_available: z.boolean().nullish(), vehicle_commands_available: z.boolean().nullish(), is_portal_vehicle: z.boolean().nullish(), available_commands: z.array(z.any().nullish()).nullish(), has_service_alert_access: z.boolean().nullish(), has_charging_history_access: z.boolean().nullish(), has_charging_invoice_access: z.boolean().nullish(), in_motion: z.boolean().nullish(), tires: z.object({ front_left_pressure: z.number().nullish(), front_right_pressure: z.number().nullish(), rear_left_pressure: z.number().nullish(), rear_right_pressure: z.number().nullish(), front_recommended_pressure: z.number().nullish(), rear_recommended_pressure: z.number().nullish() }).nullish(), battery_health: z.object({ derived_usable_capacity: z.number().nullish(), derived_rated_range_km: z.number().nullish() }).nullish(), anti_theft_mode: z.boolean().nullish(), sentry_mode_enabled: z.boolean().nullish(), sentry_mode_presently_available: z.boolean().nullish(), sentry_persistence_active: z.any().nullish(), remote_start_enabled: z.boolean().nullish(), charging_state_string: z.string().nullish(), charge_port_latch_string_enum: z.string().nullish(), charge_port_open: z.boolean().nullish(), trunk_value: z.number().nullish(), frunk_value: z.number().nullish() })

const vehicleControls = vehicleListing.pick({
	locked: true,
	charge_port_open: true,
	anti_theft_mode: true,
	remote_start_enabled: true,
	sentry_mode_enabled: true,
	trunk_value: true,
	frunk_value: true,
})

export type VehicleControls = z.infer<typeof vehicleControls>

const vehicleControlCols = vehicleControls.keyof();

export type VehicleControlCols = z.infer<typeof vehicleControlCols>

export const vehicleListParser = z.object({
	version: z.string(),
	vehicle_list: vehicleListing.array(),
	error_ids: z.array(z.unknown()),
	shard_base_url: z.null(),
	override_button_data: z.object({
		text: z.string(),
		variant: z.string(),
		macro: z.string(),
		command: z.string(),
	}),
	tesla_user_id: z.null(),
	needs_to_authenticate_with_tesla: z.boolean(),
	subscription_state: z.object({
		any_active_subscription: z.boolean(),
		subscription_visibility: z.boolean(),
	}),
	settings: z.object({
		company_name: z.string(),
		user_email: z.string(),
		minimum_charge: z.number(),
		peak_hours_text: z.string(),
		peak_or_off_peak_text: z.string(),
		default_charge_limit: z.number(),
		last_updated_date: z.number(),
		dashboard_type: z.string(),
		intercom_user_hash: z.string(),
	}),
});

export type VehicleSolo = z.infer<typeof vehicleListing>

const truncatedSolo = vehicleListing.pick({
	VIN: true,
	name: true,
	monitor_id: true,
	car_image_path: true
})

export type TruncatedSolo = z.infer<typeof truncatedSolo>
