import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmRole } from '../../adm-role/entities/adm-role.entity';
import { AdmMenu } from '../../adm-menu/entities/adm-menu.entity';

@Entity('ref_privilage')
export class RefPrivilage {
  @PrimaryGeneratedColumn({ name: 'id_privilage' })
  idPrivilage: number;

  @Column({ name: 'id_role' })
  idRole: number;

  @Column({ name: 'id_menu' })
  idMenu: number;

  @Column({ name: 'can_read', default: false })
  canRead: boolean;

  @Column({ name: 'can_create', default: false })
  canCreate: boolean;

  @Column({ name: 'can_update', default: false })
  canUpdate: boolean;

  @Column({ name: 'can_delete', default: false })
  canDelete: boolean;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @ManyToOne(() => AdmRole)
  @JoinColumn({ name: 'id_role' })
  role: AdmRole;

  @ManyToOne(() => AdmMenu)
  @JoinColumn({ name: 'id_menu' })
  menu: AdmMenu;
}
