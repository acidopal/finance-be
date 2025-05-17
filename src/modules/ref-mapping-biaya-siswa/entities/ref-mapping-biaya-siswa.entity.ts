import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';
import { RefSiswa } from '../../ref-siswa/entities/ref-siswa.entity';

@Entity('ref_mapping_biaya_siswa')
export class RefMappingBiayaSiswa {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'id_siswa', nullable: false })
  idSiswa: number;

  @Column({ name: 'id_ppdb', nullable: false })
  idPpdb: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'id_coa', nullable: false })
  idCoa: number;

  @Column({ nullable: false })
  dicicil: number;

  @Column({ name: 'dana_opsional', nullable: false, default: 0 })
  danaOpsional: number;

  @Column({ nullable: false })
  kelas: number;

  @Column({ length: 10, nullable: false, default: '0' })
  periode: string;

  @Column({ name: 'jenis_pembayaran', length: 60, nullable: false })
  jenisPembayaran: string;

  @Column({ name: 'tahun_ajaran', length: 12, nullable: false })
  tahunAjaran: string;

  @Column({ nullable: false })
  besarnya: number;

  @Column({ nullable: false })
  status: number;

  @Column({ name: 'sts_dsp', nullable: false, default: 0 })
  stsDsp: number;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;

  @ManyToOne(() => RefSiswa)
  @JoinColumn({ name: 'id_siswa' })
  siswa: RefSiswa;
}
