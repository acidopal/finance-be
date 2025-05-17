import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';
import { RefSiswa } from '../../ref-siswa/entities/ref-siswa.entity';
import { RefSppType } from '../../ref-spp-type/entities/ref-spp-type.entity';

@Entity('kas_spp')
export class KasSpp {
  @PrimaryGeneratedColumn({ name: 'id_kas_spp' })
  idKasSpp: number;

  @Column({ name: 'id_tahun_ajaran' })
  idTahunAjaran: number;

  @Column({ name: 'id_siswa' })
  idSiswa: number;

  @Column({ name: 'id_spp_type', nullable: true })
  idSppType: number;

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

  @ManyToOne(() => RefSiswa)
  @JoinColumn({ name: 'id_siswa' })
  siswa: RefSiswa;

  @ManyToOne(() => RefSppType)
  @JoinColumn({ name: 'id_spp_type' })
  sppType: RefSppType;
}
