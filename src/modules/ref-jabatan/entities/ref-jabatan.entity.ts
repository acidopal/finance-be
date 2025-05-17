import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_jabatan')
export class RefJabatan {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ length: 50, name: 'jabatan', nullable: true })
  jabatan: string;

  @Column({ length: 50, name: 'keterangan', nullable: true })
  keterangan: string;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: true })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
