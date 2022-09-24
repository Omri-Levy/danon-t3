/*
  Warnings:

  - You are about to alter the column `packageSize` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `packageSize` DECIMAL(65, 30) NOT NULL;
