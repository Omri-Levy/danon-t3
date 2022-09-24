/*
  Warnings:

  - You are about to alter the column `packageSize` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(5,2)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `packageSize` DECIMAL(5, 2) NOT NULL;
