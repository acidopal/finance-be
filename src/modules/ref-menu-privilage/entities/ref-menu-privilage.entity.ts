import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_menu_privilage')
export class RefMenuPrivilage {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'privilage_name', length: 20, nullable: false })
  privilageName: string;

  @Column({ name: 'privilage_desc', length: 200, nullable: false })
  privilageDesc: string;

  @Column({ type: 'date', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 20, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'date', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;
}
