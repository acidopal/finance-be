import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';

@Entity('ppdb_komponen_biaya')
export class PpdbKomponenBiaya {
  @PrimaryGeneratedColumn({ name: 'id_ppdb_komponen_biaya' })
  idPpdbKomponenBiaya: number;

  @Column({ name: 'id_tahun_ajaran_ppd' })
  idTahunAjaranPpd: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

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

  @ManyToOne(() => AdmTahunAjaran)
  @JoinColumn({ name: 'id_tahun_ajaran_ppd', referencedColumnName: 'idTahunAjaran' })
  tahunAjaranPpd: AdmTahunAjaran;
}
