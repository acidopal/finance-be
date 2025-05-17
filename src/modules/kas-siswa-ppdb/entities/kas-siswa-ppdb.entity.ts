import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';
import { PpdbSiswa } from '../../ppdb-siswa/entities/ppdb-siswa.entity';
import { PpdbKomponenBiaya } from '../../ppdb-komponen-biaya/entities/ppdb-komponen-biaya.entity';

@Entity('kas_siswa_ppdb')
export class KasSiswaPpdb {
  @PrimaryGeneratedColumn({ name: 'id_kas_siswa_ppdb' })
  idKasSiswaPpdb: number;

  @Column({ name: 'id_tahun_ajaran_ppd' })
  idTahunAjaranPpd: number;

  @Column({ name: 'id_ppdb_siswa' })
  idPpdbSiswa: number;

  @Column({ name: 'id_ppdb_komponen_biaya', nullable: true })
  idPpdbKomponenBiaya: number;

  @Column({ length: 20, name: 'no_transaksi' })
  noTransaksi: string;

  @Column({ type: 'date', name: 'tanggal_transaksi' })
  tanggalTransaksi: Date;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

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
