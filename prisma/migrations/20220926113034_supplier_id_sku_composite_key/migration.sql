/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Product_sku_key` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`supplierId`, `sku`);
