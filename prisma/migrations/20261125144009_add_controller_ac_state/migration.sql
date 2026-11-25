-- CreateEnum
CREATE TYPE "AcMode" AS ENUM ('HEAT', 'DRY', 'COOL', 'FAN');

-- CreateEnum
CREATE TYPE "AcFan" AS ENUM ('AUTO', 'LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Controller" ADD COLUMN     "fan" "AcFan" NOT NULL DEFAULT 'AUTO',
ADD COLUMN     "mode" "AcMode" NOT NULL DEFAULT 'COOL',
ADD COLUMN     "power" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "swingHorizontal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "swingVertical" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "temp" INTEGER NOT NULL DEFAULT 23,
ADD COLUMN     "turbo" BOOLEAN NOT NULL DEFAULT false;
