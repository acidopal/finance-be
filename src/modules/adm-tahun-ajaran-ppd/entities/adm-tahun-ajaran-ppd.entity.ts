import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';

@Entity('ref_tahun_ajaran')
export class AdmTahunAjaranPpd {
  @PrimaryGeneratedColumn({ name: 'row_id' })
  idTahunAjaranPpd: number;

  @Column({ length: 20, name: 'tahun_ajaran' })
  tahunAjaranPpd: string;

  @Column({ name: 'keterangan', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', length: 1 })
  status: string;

  @Column({ name: 'sts_ppdb' })
  stsPpdb: number;

  @Column({ name: 'id_tahun_ajaran', nullable: true })
  idTahunAjaran: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @ManyToOne(() => AdmTahunAjaran)
  @JoinColumn({ name: 'id_tahun_ajaran' })
  tahunAjaran: AdmTahunAjaran;
}
