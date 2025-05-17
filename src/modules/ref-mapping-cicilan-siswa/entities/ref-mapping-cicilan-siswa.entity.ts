import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';
import { RefSiswa } from '../../ref-siswa/entities/ref-siswa.entity';

@Entity('ref_mapping_cicilan_siswa')
export class RefMappingCicilanSiswa {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'id_id', length: 10, nullable: false })
  idId: string;

  @Column({ name: 'id_siswa', nullable: false })
  idSiswa: number;

  @Column({ name: 'id_ppdb', nullable: false })
  idPpdb: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'id_coa', nullable: false })
  idCoa: number;

  @Column({ nullable: false })
  kelas: number;

  @Column({ name: 'jenis_pembayaran', length: 30, nullable: false })
  jenisPembayaran: string;

  @Column({ name: 'tahun_ajaran', length: 12, nullable: false })
  tahunAjaran: string;

  @Column({ nullable: false })
  besarnya: number;

  @Column({ nullable: false })
  status: number;

  @Column({ name: 'dibayar_sekali', nullable: false })
  dibayarSekali: number;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;

  @ManyToOne(() => RefSiswa)
  @JoinColumn({ name: 'id_siswa' })
  siswa: RefSiswa;
}
