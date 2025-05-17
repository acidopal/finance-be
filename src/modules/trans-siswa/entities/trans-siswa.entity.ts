import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSiswa } from '../../ref-siswa/entities/ref-siswa.entity';

@Entity('trans_siswa')
export class TransSiswa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, name: 'no_faktur', nullable: true })
  noFaktur: string;

  @Column({ name: 'id_siswa', nullable: true })
  idSiswa: number;

  @ManyToOne(() => RefSiswa)
  @JoinColumn({ name: 'id_siswa' })
  siswa: RefSiswa;

  @Column({ length: 20, name: 'tahun_ajaran', nullable: true })
  tahunAjaran: string;

  @Column({ length: 50, name: 'jenis_pembayaran', nullable: true })
  jenisPembayaran: string;

  @Column({ type: 'date', name: 'tanggal_pembayaran', nullable: true })
  tanggalPembayaran: Date;

  @Column({ type: 'float', precision: 9, scale: 0, nullable: true })
  besarnya: number;

  @Column({ length: 10, nullable: true })
  kelas: string;

  @Column({ length: 10, name: 'id_list_biaya', nullable: true })
  idListBiaya: string;

  @Column({ name: 'id_ref_list_biaya' })
  idRefListBiaya: number;

  @Column({ length: 15, nullable: true })
  status: string;

  @Column({ length: 10, nullable: true })
  kodedesk: string;

  @Column({ length: 10, nullable: true })
  kodesub: string;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'date', name: 'created_date', nullable: true })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'date', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @Column({ name: 'id_wali_kelas', nullable: true })
  idWaliKelas: number;

  @Column({ name: 'sts_ppdb' })
  stsPpdb: number;

  @Column()
  cicilan: number;

  @Column({ name: 'id_jenis_bayar', default: 1 })
  idJenisBayar: number;
}
