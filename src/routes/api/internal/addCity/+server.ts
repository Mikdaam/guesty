import prisma from "$lib/utils/prisma";
import { error } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async (event: RequestEvent) => {
    try {
        const body = await event.request.json();
        const { cityId } = body;

        // Check if the city with the given ID exists
        const cityExists = await prisma.city.findUnique({
            where: { id: cityId },
        });

        if (!cityExists) {
            return error(404, 'City not found');
        }

        // Save the city in the guestOriginCity table
        await prisma.guestOriginCity.create({
            data: {
                cityId,
            },
        });

        return new Response(
            JSON.stringify({
                status: 200,
                body: { success: true },
            })
        );
    } catch (e) {
        error(500, 'Internal Server Error');
    } finally {
        await prisma.$disconnect();
    }
};
