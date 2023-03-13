import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportControlSendTable1678651633661
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report_control_send" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "merchant_id" character varying NOT NULL, 
        "report_id" character varying NOT NULL, 
        "type" character varying NOT NULL, 
        "level" character varying NOT NULL, 
        "last_send" TIMESTAMP, 
        "days_frequency" character varying NOT NULL, 
        "cut_off_day" character varying, 
        "cut_off_time" text array NOT NULL, 
        "created_by" character varying NOT NULL, 
        "updated_by" character varying, 
        "create_date" TIMESTAMP NOT NULL DEFAULT now(), 
        "update_date" TIMESTAMP, 
        CONSTRAINT "PK_083e8fbc05910f1c2cfcb85fcd8" PRIMARY KEY ("id"))`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "report_control_send"`);
  }
}
