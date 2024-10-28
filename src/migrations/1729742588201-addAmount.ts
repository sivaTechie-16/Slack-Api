import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAmount1729742588201 implements MigrationInterface {
    name = 'AddAmount1729742588201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lunch_count" DROP CONSTRAINT "FK_34d6968f37986b7c428090f4214"`);
        await queryRunner.query(`ALTER TABLE "lunch_count" DROP COLUMN "userNameId"`);
        await queryRunner.query(`ALTER TABLE "lunch_count" ADD "userName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lunch_count" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "lunch_count" ADD CONSTRAINT "FK_63367d8ef9bfba34ea1501a91c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lunch_count" DROP CONSTRAINT "FK_63367d8ef9bfba34ea1501a91c8"`);
        await queryRunner.query(`ALTER TABLE "lunch_count" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "lunch_count" DROP COLUMN "userName"`);
        await queryRunner.query(`ALTER TABLE "lunch_count" ADD "userNameId" integer`);
        await queryRunner.query(`ALTER TABLE "lunch_count" ADD CONSTRAINT "FK_34d6968f37986b7c428090f4214" FOREIGN KEY ("userNameId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
