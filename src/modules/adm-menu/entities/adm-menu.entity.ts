import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('adm_menu')
export class AdmMenu {
  @PrimaryGeneratedColumn({ name: 'id_menu' })
  idMenu: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  url: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'order_no', default: 0 })
  orderNo: number;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  // Self-referencing relationship
  @ManyToOne(() => AdmMenu, menu => menu.children)
  @JoinColumn({ name: 'parent_id' })
  parent: AdmMenu;

  @OneToMany(() => AdmMenu, menu => menu.parent)
  children: AdmMenu[];
}
