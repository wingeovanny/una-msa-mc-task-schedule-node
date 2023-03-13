import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexByConfigId1678652272660 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_report_control_send_report_id" ON "report_control_send" ("report_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_report_control_send_report_id"`);
  }
}
