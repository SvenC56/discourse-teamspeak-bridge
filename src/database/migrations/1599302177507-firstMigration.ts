import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1599302177507 implements MigrationInterface {
    name = 'firstMigration1599302177507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `assignment` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `assignment` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `assignment` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `assignment` ADD `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `assignment` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `assignment` ADD `updatedAt` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `assignment` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `assignment` ADD `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

}
