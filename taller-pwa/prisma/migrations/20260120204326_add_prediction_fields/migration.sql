/*
  Warnings:

  - You are about to drop the column `additional_services` on the `technical_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `technical_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_hours` on the `technical_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_lines_of_code` on the `technical_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_months` on the `technical_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_weeks` on the `technical_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `total_cost` on the `technical_predictions` table. All the data in the column will be lost.
  - The `assumptions` column on the `technical_predictions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estimation_model` column on the `technical_predictions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `development_cost_mxn` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infrastructure_cost_mxn` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_cost_mxn` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_cost_usd` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_hours` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_months` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_weeks` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `technical_predictions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ChatStatus" ADD VALUE 'PREDICTION_GENERATED';

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "prediction_generated_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "technical_predictions" DROP COLUMN "additional_services",
DROP COLUMN "currency",
DROP COLUMN "estimated_hours",
DROP COLUMN "estimated_lines_of_code",
DROP COLUMN "estimated_months",
DROP COLUMN "estimated_weeks",
DROP COLUMN "total_cost",
ADD COLUMN     "contingency_percentage" DOUBLE PRECISION NOT NULL DEFAULT 15,
ADD COLUMN     "development_cost_mxn" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "infrastructure_cost_mxn" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "project_type" VARCHAR(50) NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "recommendations" TEXT[],
ADD COLUMN     "timeline" JSONB,
ADD COLUMN     "total_cost_mxn" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_cost_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_hours" INTEGER NOT NULL,
ADD COLUMN     "total_months" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_weeks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ALTER COLUMN "project_summary" DROP NOT NULL,
ALTER COLUMN "scope_description" DROP NOT NULL,
DROP COLUMN "assumptions",
ADD COLUMN     "assumptions" TEXT[],
DROP COLUMN "estimation_model",
ADD COLUMN     "estimation_model" VARCHAR(50),
ALTER COLUMN "confidence_level" DROP NOT NULL;

-- DropEnum
DROP TYPE "EstimationModel";

-- CreateIndex
CREATE INDEX "technical_predictions_user_id_idx" ON "technical_predictions"("user_id");
