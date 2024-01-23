import prisma from "$lib/utils/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        // Fetch data from the database, including the count of guestCities for each city
        const citiesWithGuests = await prisma.city.findMany({
            include: {
                _count: {
                    select: { guestCities: true },
                },
            },
        });

        // Map the data to the format needed for the Svelte page
        const points = citiesWithGuests.flatMap((city) => {
            return Array.from({ length: city._count.guestCities }, () => ({
                cityFullName: `${city.name}, ${city.adminName} ${city.country} - ${city._count.guestCities} guests`,
                coordinates: [city.lat, city.lng],
            }));
        });

        // Return the data to be used by the page component
        return {
            points: points,
        };
    } catch (error) {
        // Handle errors if any
        console.error("Error fetching data from the database:", error);
        return {
            status: 500,
            error: new Error("Internal Server Error"),
        };
    }
};
