import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';
import { RefJur } from '../../ref-jur/entities/ref-jur.entity';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';

@Entity('ppdb_siswa')
export class PpdbSiswa {
  @PrimaryGeneratedColumn({ name: 'id_daftar' })
  idDaftar: number;

  @Column({ length: 50, nullable: false })
  nama: string;

  @Column({ length: 1, name: 'jenis_kelamin', nullable: false })
  jenisKelamin: string;

  @Column({ length: 11, nullable: false })
  nisn: string;

  @Column({ length: 20, nullable: false })
  agama: string;

  @Column({ length: 25, name: 'tempat_lahir', nullable: true })
  tempatLahir: string;

  @Column({ type: 'date', name: 'tanggal_lahir', nullable: true })
  tanggalLahir: Date;

  @Column({ length: 50, name: 'asal_sekolah', nullable: false })
  asalSekolah: string;

  @Column({ length: 50, name: 'nama_ayah', nullable: false })
  namaAyah: string;

  @Column({ length: 50, name: 'pekerjaan_ayah', nullable: false })
  pekerjaanAyah: string;

  @Column({ length: 50, name: 'nama_ibu', nullable: false })
  namaIbu: string;

  @Column({ length: 50, name: 'pekerjaan_ibu', nullable: false })
  pekerjaanIbu: string;

  @Column({ type: 'text', nullable: true })
  alamat: string;

  @Column({ length: 25, nullable: true })
  telepon: string;

  @Column({ length: 11, name: 'tahun_ajaran', nullable: false })
  tahunAjaran: string;

  @Column({ name: 'id_smk', nullable: true })
  idSmk: number;

  @Column({ name: 'id_jur', nullable: false })
  idJur: number;

  @Column({ name: 'no_type', nullable: false })
  noType: number;

  @Column({ name: 'total_cicilan', type: 'float', nullable: false })
  totalCicilan: number;

  @Column({ nullable: false })
  kelas: number;

  @Column({ length: 20, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'date', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'date', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @Column({ length: 1, name: 'approval_status', nullable: true })
  approvalStatus: string;

  @Column({ length: 20, name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ type: 'date', name: 'approved_date', nullable: true })
  approvedDate: Date;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;

  @ManyToOne(() => RefJur)
  @JoinColumn({ name: 'id_jur' })
  jur: RefJur;

  @Column({ name: 'id_tahun_ajaran_ppd', nullable: true })
  idTahunAjaranPpd: number;

  @ManyToOne(() => AdmTahunAjaran)
  @JoinColumn({ name: 'id_tahun_ajaran_ppd', referencedColumnName: 'idTahunAjaran' })
  tahunAjaranPpd: AdmTahunAjaran;
}
