-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
