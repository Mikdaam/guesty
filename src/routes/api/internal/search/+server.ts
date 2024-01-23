import prisma from '$lib/utils/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const searchTerm = url.searchParams.get('searchTerm');

    try {
        if (!searchTerm || searchTerm.length < 3) {
            return new Response(
                JSON.stringify({
                    status: 400,
                    message: 'Search term must be at least 3 characters long',
                })
            )
        }

        const filteredResults = await prisma.city.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm } },
                    { adminName: { contains: searchTerm } },
                    { country: { contains: searchTerm } },
                ],
            },
            take: 10,
        });

        return new Response(
            JSON.stringify({
                status: 200,
                message: 'Success',
                data: filteredResults,
            })
        );
    } catch (e) {
        console.error(e);
        error(500, 'Internal server error');
    } finally {
        await prisma.$disconnect();
    }
};
