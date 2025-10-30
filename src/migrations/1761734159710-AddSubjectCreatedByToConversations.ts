import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubjectCreatedByToConversations1761734159710 implements MigrationInterface {
    name = 'AddSubjectCreatedByToConversations1761734159710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" ADD "phone_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "created_by" character varying`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "status" character varying NOT NULL DEFAULT 'OPEN'`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_664e8d7cbdae35df5cae341352a" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_eff6596193e3e64a04433368f28" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_eff6596193e3e64a04433368f28"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_664e8d7cbdae35df5cae341352a"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "phone_number"`);
    }

}
