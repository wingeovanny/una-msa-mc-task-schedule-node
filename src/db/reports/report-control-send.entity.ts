import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('report_control_send')
export class ReportControlSend {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'merchant_id', nullable: false })
  merchantId: string;

  @Column({ name: 'report_id', nullable: false })
  reportId: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  level: string; // Unificado, sucursal

  @Column({ name: 'last_send', nullable: true })
  lastSend?: Date;

  @Column({ name: 'days_frequency', nullable: false })
  daysFrequency: string;

  @Column({ name: 'cut_off_day', nullable: true })
  cutOffDay: string;

  @Column({ name: 'cut_off_time', type: 'text', array: true })
  cutOffTime: string[];

  @Column({ name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;

  @CreateDateColumn({
    name: 'create_date',
    type: 'timestamp',
  })
  createDate?: Date;

  @UpdateDateColumn({
    name: 'update_date',
    type: 'timestamp',
    nullable: true,
  })
  updateDate?: Date;
}
