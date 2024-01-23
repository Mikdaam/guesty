-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "adminName" TEXT NOT NULL,
    "country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "guestOriginCity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cityId" INTEGER NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guestOriginCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
