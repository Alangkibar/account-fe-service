import { isValidOrigin } from "$lib/config/origins";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const origin = url.searchParams.get('origin');

    if (!isValidOrigin(origin)) {
        throw error(403, 'Access denied.');
    }

    return {
        origin
    };
};