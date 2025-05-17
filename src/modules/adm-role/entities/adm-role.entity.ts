import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adm_role')
export class AdmRole {
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @Column({ length: 50, name: 'role_name' })
  roleName: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
