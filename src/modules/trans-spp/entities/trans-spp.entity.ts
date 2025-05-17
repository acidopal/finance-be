import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSiswa } from '../../ref-siswa/entities/ref-siswa.entity';

@Entity('trans_spp')
export class TransSpp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, nullable: true })
  nis: string;

  @Column({ length: 10, name: 'id_siswa', nullable: true })
  idSiswa: string;

  @Column({ length: 10, name: 'tahun_ajaran', nullable: true })
  tahunAjaran: string;

  @Column({ type: 'date', name: 'tanggal_transaksi', nullable: true })
  tanggalTransaksi: Date;

  @Column({ length: 10, nullable: true })
  bulan: string;

  @Column({ type: 'float', precision: 9, scale: 0, nullable: true })
  besarnya: number;

  @Column({ length: 10, name: 'print_status', nullable: true })
  printStatus: string;

  @Column({ type: 'date', name: 'tanggal_input', nullable: true })
  tanggalInput: Date;

  @Column({ length: 20, name: 'no_faktur', nullable: true })
  noFaktur: string;

  @Column({ length: 10, nullable: true })
  kodedesk: string;

  @Column({ length: 10, nullable: true })
  kodesub: string;

  @Column({ name: 'id_wali_kelas', nullable: true })
  idWaliKelas: number;

  @Column({ name: 'sts_ppdb', nullable: false })
  stsPpdb: number;

  @Column({ name: 'id_jenis_bayar', default: 1, nullable: false })
  idJenisBayar: number;

  @Column({ length: 20, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
