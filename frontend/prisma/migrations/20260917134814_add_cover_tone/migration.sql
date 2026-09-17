-- CreateEnum
CREATE TYPE "CoverTone" AS ENUM ('saffron', 'petrol', 'ink', 'moss', 'clay');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "coverTone" "CoverTone" NOT NULL DEFAULT 'petrol';
