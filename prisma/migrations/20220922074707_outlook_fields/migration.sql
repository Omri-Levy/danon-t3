/*
  Warnings:

  - Added the required column `id_token_expires_in` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `not_before` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token_expires_in` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `id_token_expires_in` INTEGER NOT NULL,
    ADD COLUMN `not_before` INTEGER NOT NULL,
    ADD COLUMN `profile_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `refresh_token_expires_in` INTEGER NOT NULL;
