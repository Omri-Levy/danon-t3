/*
  Warnings:

  - You are about to drop the column `id_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `not_before` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - Added the required column `ext_expires_in` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `id_token_expires_in`,
    DROP COLUMN `not_before`,
    DROP COLUMN `profile_id`,
    DROP COLUMN `refresh_token_expires_in`,
    ADD COLUMN `ext_expires_in` INTEGER NOT NULL;
