-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIE', 'BOOK');

-- CreateEnum
CREATE TYPE "NegotiationType" AS ENUM ('SALE', 'RENT');

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "authorName" TEXT,
    "description" TEXT,
    "releaseYear" INTEGER NOT NULL,
    "mediaType" "MediaType" NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "mediaId" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "availableFor" "NegotiationType"[],
    "salePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rentalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Negotiation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "negotiationType" "NegotiationType" NOT NULL,
    "totalPrice" DOUBLE PRECISION,
    "customerId" INTEGER NOT NULL,
    "scheduledDeliveryAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "Negotiation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GenreToMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_NegotiationToUnit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_title_mediaType_key" ON "Media"("title", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_title_key" ON "Genre"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToMedia_AB_unique" ON "_GenreToMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToMedia_B_index" ON "_GenreToMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_NegotiationToUnit_AB_unique" ON "_NegotiationToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_NegotiationToUnit_B_index" ON "_NegotiationToUnit"("B");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NegotiationToUnit" ADD CONSTRAINT "_NegotiationToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "Negotiation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NegotiationToUnit" ADD CONSTRAINT "_NegotiationToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
