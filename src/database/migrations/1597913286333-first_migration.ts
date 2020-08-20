import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1597913286333 implements MigrationInterface {
    name = 'firstMigration1597913286333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `assignment` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `shield` tinyint NOT NULL, `tsid` int NOT NULL, `dcid` int NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_ca46f5aefa97a7f3322b347be3` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_ca46f5aefa97a7f3322b347be3` ON `assignment`");
        await queryRunner.query("DROP TABLE `assignment`");
    }

}
