import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1759735737805 implements MigrationInterface {
    name = 'Init1759735737805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('TENANT_ADMIN', 'MANAGER', 'AGENT', 'AUDITOR')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."messages_direction_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "session_id" uuid NOT NULL, "direction" "public"."messages_direction_enum" NOT NULL, "phone_number" character varying NOT NULL, "text" character varying NOT NULL, "raw_json" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "waha_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "external_session_id" character varying, "status" character varying NOT NULL DEFAULT 'CREATED', "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cd3270031b4df00690f811f2359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_558150f45586066db2415eb28c5" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ff71b7760071ed9caba7f02beb4" FOREIGN KEY ("session_id") REFERENCES "waha_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "waha_sessions" ADD CONSTRAINT "FK_fdf685ed6b82f130c97fbad7bd4" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waha_sessions" DROP CONSTRAINT "FK_fdf685ed6b82f130c97fbad7bd4"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ff71b7760071ed9caba7f02beb4"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_558150f45586066db2415eb28c5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`);
        await queryRunner.query(`DROP TABLE "waha_sessions"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_direction_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
