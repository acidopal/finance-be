# Database Documentation - Finance Pesat

This document provides an overview of the database structure for the Finance Pesat application.

## Database Overview

The Finance Pesat database consists of 40 tables organized into several logical groups:

1. **Administration (adm_)**: User management, roles, and system configuration
2. **Reference (ref_)**: Master data tables
3. **Transaction (trans_)**: Financial transactions
4. **Report (rep_)**: Reporting tables
5. **PPDB**: Student admission related tables
6. **Other**: Miscellaneous tables

## Table Structure

### Administration Tables

#### adm_user
| Field         | Type         | Null | Key | Default | Extra          |
|---------------|--------------|------|-----|---------|----------------|
| id            | int          | NO   | PRI | NULL    | auto_increment |
| username      | varchar(50)  | NO   |     | NULL    |                |
| password      | varchar(100) | NO   |     | NULL    |                |
| email         | varchar(100) | YES  |     | NULL    |                |
| fullname      | varchar(100) | YES  |     | NULL    |                |
| is_active     | tinyint      | NO   |     | 1       |                |
| last_login    | datetime     | YES  |     | NULL    |                |
| created_by    | varchar(20)  | NO   |     | NULL    |                |
| created_date  | datetime     | NO   |     | NULL    |                |
| modified_by   | varchar(20)  | YES  |     | NULL    |                |
| modified_date | datetime     | YES  |     | NULL    |                |

**Note**: The password field stores MD5 hashed passwords.

### Reference Tables

#### ref_karyawan
| Field                  | Type        | Null | Key | Default | Extra          |
|------------------------|-------------|------|-----|---------|----------------|
| id                     | int         | NO   | PRI | NULL    | auto_increment |
| nama_karyawan          | varchar(50) | YES  |     | NULL    |                |
| jenis_kelamin          | varchar(1)  | YES  |     | NULL    |                |
| alamat                 | varchar(50) | YES  |     | NULL    |                |
| telepon                | varchar(20) | YES  |     | NULL    |                |
| tempat_lahir           | varchar(30) | YES  |     | NULL    |                |
| tanggal_lahir          | date        | YES  |     | NULL    |                |
| agama                  | varchar(20) | YES  |     | NULL    |                |
| jabatan                | varchar(20) | YES  |     | NULL    |                |
| nonuptk                | varchar(20) | YES  |     | NULL    |                |
| unit_kerja             | varchar(30) | YES  |     | NULL    |                |
| bidang_studi           | varchar(30) | YES  |     | NULL    |                |
| masa_kerja             | int         | YES  |     | NULL    |                |
| pendidikan             | varchar(20) | YES  |     | NULL    |                |
| tanggal_masuk          | date        | YES  |     | NULL    |                |
| pengalamanorganisasi_a | varchar(30) | YES  |     | NULL    |                |
| pengalamanorganisasi_b | varchar(30) | YES  |     | NULL    |                |
| pengalamanorganisasi_c | varchar(30) | YES  |     | NULL    |                |
| pengalamankerja_a      | varchar(30) | YES  |     | NULL    |                |
| pengalamankerja_b      | varchar(30) | YES  |     | NULL    |                |
| pengalamankerja_c      | varchar(30) | YES  |     | NULL    |                |
| mime_type              | varchar(50) | YES  |     | NULL    |                |
| nik                    | varchar(20) | YES  |     | NULL    |                |
| created_by             | varchar(20) | YES  |     | NULL    |                |
| created_date           | datetime    | YES  |     | NULL    |                |
| modified_by            | varchar(20) | YES  |     | NULL    |                |
| modified_date          | datetime    | YES  |     | NULL    |                |

**Note**: The `jabatan` field is a string field, not a relation to ref_jabatan.

#### ref_jabatan
| Field         | Type        | Null | Key | Default | Extra          |
|---------------|-------------|------|-----|---------|----------------|
| id            | int         | NO   | PRI | NULL    | auto_increment |
| jabatan       | varchar(50) | YES  |     | NULL    |                |
| keterangan    | varchar(50) | YES  |     | NULL    |                |
| created_by    | varchar(20) | YES  |     | NULL    |                |
| created_date  | datetime    | YES  |     | NULL    |                |
| modified_by   | varchar(20) | YES  |     | NULL    |                |
| modified_date | datetime    | YES  |     | NULL    |                |

#### ref_siswa
| Field            | Type         | Null | Key | Default | Extra          |
|------------------|--------------|------|-----|---------|----------------|
| id_siswa         | int          | NO   | PRI | NULL    | auto_increment |
| nama             | varchar(50)  | NO   |     | NULL    |                |
| agama            | varchar(20)  | NO   |     | NULL    |                |
| asal_sekolah     | varchar(40)  | NO   |     | NULL    |                |
| jenis_kelamin    | varchar(1)   | NO   |     | NULL    |                |
| nisn             | varchar(11)  | NO   |     | NULL    |                |
| nis              | varchar(20)  | YES  |     | NULL    |                |
| tempat_lahir     | varchar(25)  | YES  |     | NULL    |                |
| tanggal_lahir    | date         | YES  |     | NULL    |                |
| nama_ayah        | varchar(50)  | YES  |     | NULL    |                |
| pekerjaan_ayah   | varchar(30)  | NO   |     | NULL    |                |
| nama_ibu         | varchar(50)  | YES  |     | NULL    |                |
| pekerjaan_ibu    | varchar(30)  | NO   |     | NULL    |                |
| alamat           | text         | YES  |     | NULL    |                |
| alamat_wali      | varchar(500) | YES  |     | NULL    |                |
| telepon_wali     | varchar(25)  | YES  |     | NULL    |                |
| nama_wali        | int          | YES  |     | NULL    |                |
| telepon          | varchar(25)  | YES  |     | NULL    |                |
| id_smk           | int          | NO   |     | NULL    |                |
| id_jur           | int          | NO   |     | NULL    |                |
| id_mapping_kelas | int          | YES  |     | NULL    |                |
| id_spp_type      | int          | NO   |     | NULL    |                |
| id_wali_kelas    | int          | YES  |     | NULL    |                |
| tahun_ajaran     | varchar(20)  | NO   |     | NULL    |                |
| kelas            | int          | NO   |     | NULL    |                |
| status           | int          | NO   |     | NULL    |                |
| syn_status       | varchar(1)   | YES  |     | NULL    |                |
| id_ppdb          | int          | NO   |     | NULL    |                |
| no_type          | int          | NO   |     | NULL    |                |
| created_by       | varchar(20)  | NO   |     | NULL    |                |
| created_date     | date         | NO   |     | NULL    |                |
| modified_by      | varchar(20)  | YES  |     | NULL    |                |
| modified_date    | date         | YES  |     | NULL    |                |

### Transaction Tables

#### trans_spp
| Field             | Type        | Null | Key | Default | Extra          |
|-------------------|-------------|------|-----|---------|----------------|
| id                | int         | NO   | PRI | NULL    | auto_increment |
| nis               | varchar(30) | YES  |     | NULL    |                |
| id_siswa          | varchar(10) | YES  |     | NULL    |                |
| tahun_ajaran      | varchar(10) | YES  |     | NULL    |                |
| tanggal_transaksi | date        | YES  |     | NULL    |                |
| bulan             | varchar(10) | YES  |     | NULL    |                |
| besarnya          | float(9,0)  | YES  |     | NULL    |                |
| print_status      | varchar(10) | YES  |     | NULL    |                |
| tanggal_input     | date        | YES  |     | NULL    |                |
| no_faktur         | varchar(20) | YES  |     | NULL    |                |
| kodedesk          | varchar(10) | YES  |     | NULL    |                |
| kodesub           | varchar(10) | YES  |     | NULL    |                |
| id_wali_kelas     | int         | YES  |     | NULL    |                |
| sts_ppdb          | int         | NO   |     | NULL    |                |
| id_jenis_bayar    | int         | NO   |     | 1       |                |
| created_by        | varchar(20) | NO   |     | NULL    |                |
| created_date      | datetime    | NO   |     | NULL    |                |
| modified_by       | varchar(20) | YES  |     | NULL    |                |
| modified_date     | datetime    | YES  |     | NULL    |                |

## Database Relationships

While there are no explicit foreign key constraints defined in the database, there are implicit relationships between tables based on field names:

1. `ref_siswa.id_smk` relates to `ref_smk.id`
2. `ref_siswa.id_jur` relates to `ref_jur.id`
3. `ref_siswa.id_mapping_kelas` relates to `ref_mapping_kelas.id`
4. `ref_siswa.id_spp_type` relates to `ref_spp_type.id`
5. `ref_siswa.id_wali_kelas` relates to `ref_karyawan.id`
6. `trans_spp.id_siswa` relates to `ref_siswa.id_siswa`
7. `trans_spp.id_jenis_bayar` relates to `ref_jenis_bayar.id`

## Common Fields

Most tables include the following audit fields:
- `created_by`: User who created the record
- `created_date`: Date and time when the record was created
- `modified_by`: User who last modified the record
- `modified_date`: Date and time when the record was last modified

## Authentication

The `adm_user` table stores user credentials with passwords hashed using MD5.

## Notes

1. There are no explicit foreign key constraints in the database.
2. In the `ref_karyawan` entity, `jabatan` is a string field, not a relation to `ref_jabatan`.
3. The database follows a naming convention where:
   - Reference tables are prefixed with `ref_`
   - Transaction tables are prefixed with `trans_`
   - Administration tables are prefixed with `adm_`
   - Report tables are prefixed with `rep_`
