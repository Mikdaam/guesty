import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse';
import path from 'path';

const prisma = new PrismaClient();
const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const filePath = path.join(__dirname, '..', 'src', 'lib', 'assets', 'worldcities.csv');
const headers: string[] = ["city", "city_ascii", "lat", "lng", "country", "iso2", "iso3", "admin_name", "capital", "population", "id"];
const contents: string = readFileSync(filePath, 'utf8');

interface CityData {
    city: string;
    city_ascii: string;
    lat: string;
    lng: string;
    country: string;
    iso2: string;
    iso3: string;
    admin_name: string;
    capital: string;
    population: string;
    id: string;
}

async function main() {
  console.log(`Start seeding ...`);

  parse(contents, { columns: headers, skip_empty_lines: true, from_line: 2 }, async (err, output) => {
    if (err) throw err;

    const cityDataArray: CityData[] = output as CityData[];

    for (const p of cityDataArray) {
      const user = await prisma.city.create({
        data: {
          name: p.city,
          lat: parseFloat(p.lat),
          lng: parseFloat(p.lng),
          adminName: p.admin_name,
          country: p.country,
        },
      });

      console.log(`Created city with id: ${user.id}`);
    }
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });