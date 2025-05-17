import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adm_config')
export class AdmConfig {
  @PrimaryGeneratedColumn({ name: 'id_config' })
  idConfig: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  value: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
