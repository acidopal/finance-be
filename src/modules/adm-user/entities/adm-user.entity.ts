import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AdmRole } from '../../adm-role/entities/adm-role.entity';
import { AdmRoleAssignment } from '../../adm-role-assignment/entities/adm-role-assignment.entity';
import { RefKaryawan } from '../../ref-karyawan/entities/ref-karyawan.entity';
import { Exclude } from 'class-transformer';

@Entity('adm_user')
export class AdmUser {
  @PrimaryGeneratedColumn({ name: 'userid' })
  idUser: number;

  @Column({ length: 50, nullable: false })
  username: string;

  @Column({ length: 50, nullable: false, name: 'alias' })
  alias: string;

  @Column({ length: 100, nullable: false })
  @Exclude({ toPlainOnly: true }) // Exclude password from responses
  password: string;

  @Column({ length: 1, nullable: false, name: 'user_status' })
  userStatus: string;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'id_karyawan', nullable: false })
  idKaryawan: number;

  @Column({ length: 20, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @Column({ type: 'datetime', name: 'last_login', nullable: true })
  lastLogin: Date;

  // Relationships
  @ManyToOne(() => AdmRole)
  @JoinColumn({ name: 'role_id' })
  role: AdmRole;

  @ManyToOne(() => RefKaryawan)
  @JoinColumn({ name: 'id_karyawan' })
  karyawan: RefKaryawan;

  @OneToMany(() => AdmRoleAssignment, roleAssignment => roleAssignment.user)
  roleAssignments: AdmRoleAssignment[];
}
