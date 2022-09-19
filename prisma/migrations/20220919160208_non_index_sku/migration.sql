-- DropIndex
DROP INDEX `Product_orderAmount_sku_idx` ON `Product`;

-- CreateIndex
CREATE INDEX `Product_orderAmount_supplierId_idx` ON `Product`(`orderAmount` ASC, `supplierId` ASC);
