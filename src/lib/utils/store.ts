import type { City } from "@prisma/client";
import { writable } from "svelte/store";

export const selectedCity = writable<City | null>(null);