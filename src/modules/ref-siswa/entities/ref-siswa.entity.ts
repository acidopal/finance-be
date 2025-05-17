import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('ref_siswa')
export class RefSiswa {
  @PrimaryGeneratedColumn({ name: 'id_siswa' })
  idSiswa: number;

  @Column({ length: 50, nullable: false })
  nama: string;

  @Column({ length: 20, nullable: false })
  agama: string;

  @Column({ length: 40, name: 'asal_sekolah', nullable: false })
  asalSekolah: string;

  @Column({ length: 1, name: 'jenis_kelamin', nullable: false })
  jenisKelamin: string;

  @Column({ length: 11, nullable: false })
  nisn: string;

  @Column({ length: 20, nullable: true })
  nis: string;

  @Column({ length: 25, name: 'tempat_lahir', nullable: true })
  tempatLahir: string;

  @Column({ type: 'date', name: 'tanggal_lahir', nullable: true })
  tanggalLahir: Date;

  @Column({ length: 50, name: 'nama_ayah', nullable: true })
  namaAyah: string;

  @Column({ length: 30, name: 'pekerjaan_ayah', nullable: false })
  pekerjaanAyah: string;

  @Column({ length: 50, name: 'nama_ibu', nullable: true })
  namaIbu: string;

  @Column({ length: 30, name: 'pekerjaan_ibu', nullable: false })
  pekerjaanIbu: string;

  @Column({ type: 'text', nullable: true })
  alamat: string;

  @Column({ length: 500, name: 'alamat_wali', nullable: true })
  alamatWali: string;

  @Column({ length: 25, name: 'telepon_wali', nullable: true })
  teleponWali: string;

  @Column({ name: 'nama_wali', nullable: true })
  namaWali: number;

  @Column({ length: 25, nullable: true })
  telepon: string;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'id_jur', nullable: false })
  idJur: number;

  @Column({ name: 'id_mapping_kelas', nullable: true })
  idMappingKelas: number;

  @Column({ name: 'id_spp_type', nullable: false })
  idSppType: number;

  @Column({ name: 'id_wali_kelas', nullable: true })
  idWaliKelas: number;

  @Column({ length: 20, name: 'tahun_ajaran', nullable: false })
  tahunAjaran: string;

  @Column({ nullable: false })
  kelas: number;

  @Column({ nullable: false })
  status: number;

  @Column({ length: 1, name: 'syn_status', nullable: true })
  synStatus: string;

  @Column({ name: 'id_ppdb', nullable: false })
  idPpdb: number;

  @Column({ name: 'no_type', nullable: false })
  noType: number;

  @Column({ length: 20, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'date', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'date', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
