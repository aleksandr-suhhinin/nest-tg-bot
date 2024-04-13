import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1712904871893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.query(
      `CREATE TABLE users (
        id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
        first_name text NOT NULL,
        last_name text,
        user_id integer NOT NULL,
        username text,
        email text,
        created_at timestamp default now(),
        updated_at timestamp,
        CONSTRAINT unique_user_id UNIQUE (user_id)
    )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
