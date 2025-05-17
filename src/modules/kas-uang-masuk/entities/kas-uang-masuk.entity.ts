import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';
import { RefListUangMasuk } from '../../ref-list-uang-masuk/entities/ref-list-uang-masuk.entity';

@Entity('kas_uang_masuk')
export class KasUangMasuk {
  @PrimaryGeneratedColumn({ name: 'id_kas_uang_masuk' })
  idKasUangMasuk: number;

  @Column({ name: 'id_tahun_ajaran' })
  idTahunAjaran: number;

  @Column({ name: 'id_list_uang_masuk', nullable: true })
  idListUangMasuk: number;

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
  @JoinColumn({ name: 'id_tahun_ajaran' })
  tahunAjaran: AdmTahunAjaran;

  @ManyToOne(() => RefListUangMasuk)
  @JoinColumn({ name: 'id_list_uang_masuk' })
  listUangMasuk: RefListUangMasuk;
}
