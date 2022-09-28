/*
  Warnings:

  - You are about to alter the column `packageSize` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `packageSize` DECIMAL(6, 2) NOT NULL;
