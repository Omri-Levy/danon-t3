-- DropIndex
DROP INDEX `Product_orderAmount_supplierId_idx` ON `Product`;

-- DropIndex
DROP INDEX `Product_sku_key` ON `Product`;

-- CreateIndex
CREATE INDEX `Product_orderAmount_sku_idx` ON `Product`(`orderAmount` ASC, `sku`);
