/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Product_orderAmount_sku_idx` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`supplierId`, `sku`);

-- CreateIndex
CREATE INDEX `Product_orderAmount_idx` ON `Product`(`orderAmount` ASC);
