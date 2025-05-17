import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_tahun_ajaran')
export class AdmTahunAjaran {
  @PrimaryGeneratedColumn({ name: 'row_id' })
  idTahunAjaran: number;

  @Column({ length: 20, name: 'tahun_ajaran' })
  tahunAjaran: string;

  @Column({ name: 'keterangan', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', length: 1 })
  status: string;

  @Column({ name: 'sts_ppdb' })
  stsPpdb: number;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
