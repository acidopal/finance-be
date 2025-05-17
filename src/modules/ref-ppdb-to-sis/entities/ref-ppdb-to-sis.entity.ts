import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';

@Entity('ref_ppdb_to_sis')
export class RefPpdbToSis {
  @PrimaryGeneratedColumn({ name: 'id_ppdb_to_sis' })
  idPpdbToSis: number;

  @Column({ name: 'id_tahun_ajaran' })
  idTahunAjaran: number;

  @Column({ name: 'id_tahun_ajaran_ppd' })
  idTahunAjaranPpd: number;

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
  @JoinColumn({ name: 'id_tahun_ajaran' })
  tahunAjaran: AdmTahunAjaran;

  @ManyToOne(() => AdmTahunAjaran)
  @JoinColumn({ name: 'id_tahun_ajaran_ppd', referencedColumnName: 'idTahunAjaran' })
  tahunAjaranPpd: AdmTahunAjaran;
}
