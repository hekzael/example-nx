import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1770619532794 implements MigrationInterface {
  name = 'InitialSchema1770619532794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "identity"
    `);
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "projects"
    `);
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "operations"
    `);
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "audit"
    `);

    await queryRunner.query(`
      CREATE TABLE "identity"."user" (
        "user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" text NOT NULL CHECK (length("email") <= 255) UNIQUE,
        "display_name" text NOT NULL CHECK (length("display_name") <= 255),
        "password_hash" text NOT NULL CHECK (length("password_hash") <= 255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."project" (
        "project_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "code" text NOT NULL CHECK (length("code") <= 100) UNIQUE,
        "name" text NOT NULL CHECK (length("name") <= 255),
        "description" text CHECK (length("description") <= 1000),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."project_environment" (
        "project_environment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"."project"("project_id") ON DELETE CASCADE,
        "code" text NOT NULL CHECK (length("code") <= 50),
        "name" text NOT NULL CHECK (length("name") <= 255),
        "description" text CHECK (length("description") <= 1000),
        "priority" integer NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        UNIQUE ("project_id", "code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."project_module" (
        "project_module_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"."project"("project_id") ON DELETE CASCADE,
        "code" text NOT NULL CHECK (length("code") <= 100),
        "name" text NOT NULL CHECK (length("name") <= 255),
        "description" text CHECK (length("description") <= 1000),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        UNIQUE ("project_id", "code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."team" (
        "team_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"."project"("project_id") ON DELETE CASCADE,
        "name" text NOT NULL CHECK (length("name") <= 255),
        "description" text CHECK (length("description") <= 1000),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        UNIQUE ("project_id", "name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."team_module" (
        "team_id" uuid NOT NULL REFERENCES "projects"."team"("team_id") ON DELETE CASCADE,
        "project_module_id" uuid NOT NULL REFERENCES "projects"."project_module"("project_module_id") ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        PRIMARY KEY ("team_id", "project_module_id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "projects"."team_member_role" AS ENUM ('LEADER_PRIMARY', 'LEADER_TEMP', 'MEMBER')
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."team_member" (
        "team_member_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "team_id" uuid NOT NULL REFERENCES "projects"."team"("team_id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "identity"."user"("user_id") ON DELETE CASCADE,
        "role" "projects"."team_member_role" NOT NULL,
        "valid_from" timestamptz NOT NULL,
        "valid_until" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."project_role" (
        "project_role_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"."project"("project_id") ON DELETE CASCADE,
        "name" text NOT NULL CHECK (length("name") <= 255),
        "description" text CHECK (length("description") <= 1000),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        UNIQUE ("project_id", "name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."project_permission" (
        "project_permission_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"."project"("project_id") ON DELETE CASCADE,
        "project_module_id" uuid REFERENCES "projects"."project_module"("project_module_id") ON DELETE SET NULL,
        "project_environment_id" uuid REFERENCES "projects"."project_environment"("project_environment_id") ON DELETE SET NULL,
        "action" text NOT NULL CHECK (length("action") <= 100),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        UNIQUE NULLS NOT DISTINCT ("project_id", "project_module_id", "project_environment_id", "action")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."project_role_permission" (
        "project_role_id" uuid NOT NULL REFERENCES "projects"."project_role"("project_role_id") ON DELETE CASCADE,
        "project_permission_id" uuid NOT NULL REFERENCES "projects"."project_permission"("project_permission_id") ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        PRIMARY KEY ("project_role_id", "project_permission_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects"."user_project_role" (
        "user_project_role_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"."project"("project_id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "identity"."user"("user_id") ON DELETE CASCADE,
        "project_role_id" uuid NOT NULL REFERENCES "projects"."project_role"("project_role_id") ON DELETE CASCADE,
        "valid_from" timestamptz NOT NULL,
        "valid_until" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "audit"."audit_log" (
        "audit_log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "actor_user_id" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "action" text NOT NULL CHECK (length("action") <= 200),
        "entity_type" text NOT NULL CHECK (length("entity_type") <= 100),
        "entity_id" uuid,
        "payload" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL,
        "updated_by" uuid REFERENCES "identity"."user"("user_id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      'CREATE INDEX "idx_team_member_team" ON "projects"."team_member" ("team_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_team_member_user" ON "projects"."team_member" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_environment_project_id" ON "projects"."project_environment" ("project_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_module_project_id" ON "projects"."project_module" ("project_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_team_project_id" ON "projects"."team" ("project_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_team_module_project_module_id" ON "projects"."team_module" ("project_module_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_role_project_id" ON "projects"."project_role" ("project_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_user_project_role_user" ON "projects"."user_project_role" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_user_project_role_project_id" ON "projects"."user_project_role" ("project_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_user_project_role_project_role_id" ON "projects"."user_project_role" ("project_role_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_permission_project" ON "projects"."project_permission" ("project_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_permission_project_module_id" ON "projects"."project_permission" ("project_module_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_permission_project_environment_id" ON "projects"."project_permission" ("project_environment_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_project_role_permission_project_permission_id" ON "projects"."project_role_permission" ("project_permission_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_audit_log_actor_user_id" ON "audit"."audit_log" ("actor_user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_audit_log_created_at" ON "audit"."audit_log" ("created_at")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "audit"."idx_audit_log_actor_user_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "audit"."idx_audit_log_created_at"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_role_permission_project_permission_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_permission_project_environment_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_permission_project_module_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_permission_project"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_user_project_role_project_role_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_user_project_role_project_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_user_project_role_user"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_role_project_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_team_module_project_module_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_team_project_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_module_project_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_project_environment_project_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_team_member_user"');
    await queryRunner.query('DROP INDEX IF EXISTS "projects"."idx_team_member_team"');

    await queryRunner.query('DROP TABLE IF EXISTS "audit"."audit_log"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."user_project_role"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."project_role_permission"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."project_permission"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."project_role"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."team_member"');
    await queryRunner.query('DROP TYPE IF EXISTS "projects"."team_member_role"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."team_module"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."team"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."project_module"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."project_environment"');
    await queryRunner.query('DROP TABLE IF EXISTS "projects"."project"');
    await queryRunner.query('DROP TABLE IF EXISTS "identity"."user"');

    await queryRunner.query('DROP SCHEMA IF EXISTS "audit"');
    await queryRunner.query('DROP SCHEMA IF EXISTS "operations"');
    await queryRunner.query('DROP SCHEMA IF EXISTS "projects"');
    await queryRunner.query('DROP SCHEMA IF EXISTS "identity"');
  }
}
