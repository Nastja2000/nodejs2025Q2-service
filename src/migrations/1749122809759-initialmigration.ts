import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialmigration1749122809759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEAFULT uuid_generate_v4(),
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                "version" integer NOT NULL DEFAULT 1,
                "createdAt" bigint NOT NULL,
                "changedAt" bigint NOT NULL,
                CONSTRAINT "PK_user" PRIMARY KEY ("id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
