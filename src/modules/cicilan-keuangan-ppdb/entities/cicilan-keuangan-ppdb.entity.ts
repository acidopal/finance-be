import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';
import { PpdbSiswa } from '../../ppdb-siswa/entities/ppdb-siswa.entity';
import { PpdbKomponenBiaya } from '../../ppdb-komponen-biaya/entities/ppdb-komponen-biaya.entity';

@Entity('cicilan_keuangan_ppdb')
export class CicilanKeuanganPpdb {
  @PrimaryGeneratedColumn({ name: 'id_cicilan_keuangan_ppdb' })
  idCicilanKeuanganPpdb: number;

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

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, name: 'remaining_amount' })
  remainingAmount: number;

  @Column({ type: 'int', default: 1, name: 'cicilan_ke' })
  cicilanKe: number;

  @Column({ type: 'int', default: 1, name: 'total_cicilan' })
  totalCicilan: number;

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
