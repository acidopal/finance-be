import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_karyawan')
export class RefKaryawan {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ length: 50, name: 'nama_karyawan', nullable: true })
  namaKaryawan: string;

  @Column({ length: 1, name: 'jenis_kelamin', nullable: true })
  jenisKelamin: string;

  @Column({ length: 50, name: 'alamat', nullable: true })
  alamat: string;

  @Column({ length: 20, name: 'telepon', nullable: true })
  telepon: string;

  @Column({ length: 30, name: 'tempat_lahir', nullable: true })
  tempatLahir: string;

  @Column({ type: 'date', name: 'tanggal_lahir', nullable: true })
  tanggalLahir: Date;

  @Column({ length: 20, name: 'agama', nullable: true })
  agama: string;

  @Column({ length: 20, name: 'jabatan', nullable: true })
  jabatan: string;

  @Column({ length: 20, name: 'nonuptk', nullable: true })
  nonuptk: string;

  @Column({ length: 30, name: 'unit_kerja', nullable: true })
  unitKerja: string;

  @Column({ length: 30, name: 'bidang_studi', nullable: true })
  bidangStudi: string;

  @Column({ name: 'masa_kerja', nullable: true })
  masaKerja: number;

  @Column({ length: 20, name: 'pendidikan', nullable: true })
  pendidikan: string;

  @Column({ type: 'date', name: 'tanggal_masuk', nullable: true })
  tanggalMasuk: Date;

  @Column({ length: 30, name: 'pengalamanorganisasi_a', nullable: true })
  pengalamanorganisasiA: string;

  @Column({ length: 30, name: 'pengalamanorganisasi_b', nullable: true })
  pengalamanorganisasiB: string;

  @Column({ length: 30, name: 'pengalamanorganisasi_c', nullable: true })
  pengalamanorganisasiC: string;

  @Column({ length: 30, name: 'pengalamankerja_a', nullable: true })
  pengalamankerjaA: string;

  @Column({ length: 30, name: 'pengalamankerja_b', nullable: true })
  pengalamankerjaB: string;

  @Column({ length: 30, name: 'pengalamankerja_c', nullable: true })
  pengalamankerjaC: string;

  @Column({ length: 50, name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ length: 20, name: 'nik', nullable: true })
  nik: string;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: true })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
