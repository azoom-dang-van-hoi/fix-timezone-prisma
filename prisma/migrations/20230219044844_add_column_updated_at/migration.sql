/*
  Warnings:

  - You are about to alter the column `created_at` on the `post` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `updated_at` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `user` ADD COLUMN `updated_at` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW();
