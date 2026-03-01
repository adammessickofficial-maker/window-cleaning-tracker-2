-- Initial schema generated for ClearPane MVP.
PRAGMA foreign_keys=OFF;
CREATE TABLE "User" ("id" TEXT PRIMARY KEY NOT NULL, "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT NOT NULL, "name" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
CREATE TABLE "Customer" ("id" TEXT PRIMARY KEY NOT NULL, "name" TEXT NOT NULL, "email" TEXT, "phone" TEXT, "tags" TEXT[] , "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
-- Run `prisma migrate dev` to generate the complete SQL for your local SQLite version.
PRAGMA foreign_keys=ON;
