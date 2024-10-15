import type { APIContext, MiddlewareNext } from "astro";

export async function onRequest(context: APIContext, next: MiddlewareNext) {
	return next();
}
