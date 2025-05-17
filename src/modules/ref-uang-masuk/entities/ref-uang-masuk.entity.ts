import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_uang_masuk')
export class RefUangMasuk {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ length: 10, nullable: true })
  kodedesk: string;

  @Column({ length: 50, nullable: true })
  deskripsi: string;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: true })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
