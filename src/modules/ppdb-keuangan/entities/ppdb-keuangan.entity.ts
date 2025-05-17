import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';
import { PpdbSiswa } from '../../ppdb-siswa/entities/ppdb-siswa.entity';
import { PpdbKomponenBiaya } from '../../ppdb-komponen-biaya/entities/ppdb-komponen-biaya.entity';

@Entity('ppdb_keuangan')
export class PpdbKeuangan {
  @PrimaryGeneratedColumn({ name: 'id_ppdb_keuangan' })
  idPpdbKeuangan: number;

  @Column({ name: 'id_tahun_ajaran_ppd' })
  idTahunAjaranPpd: number;

  @Column({ name: 'id_ppdb_siswa' })
  idPpdbSiswa: number;

  @Column({ name: 'id_ppdb_komponen_biaya' })
  idPpdbKomponenBiaya: number;

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

  @ManyToOne(() => PpdbSiswa)
  @JoinColumn({ name: 'id_ppdb_siswa' })
  ppdbSiswa: PpdbSiswa;

  @ManyToOne(() => PpdbKomponenBiaya)
  @JoinColumn({ name: 'id_ppdb_komponen_biaya' })
  ppdbKomponenBiaya: PpdbKomponenBiaya;
}
