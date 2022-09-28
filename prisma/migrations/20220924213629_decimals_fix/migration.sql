/*
  Warnings:

  - You are about to alter the column `orderAmount` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(6,2)`.
  - You are about to alter the column `stock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `orderAmount` DECIMAL(6, 2) NOT NULL,
    MODIFY `stock` DECIMAL(6, 2) NOT NULL;
