import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdmTahunAjaran } from '../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity';
import { RefSiswa } from '../../ref-siswa/entities/ref-siswa.entity';
import { RefBiaya } from '../../ref-biaya/entities/ref-biaya.entity';

@Entity('ref_siswa_komp_biaya')
export class RefSiswaKompBiaya {
  @PrimaryGeneratedColumn({ name: 'id_siswa_komp_biaya' })
  idSiswaKompBiaya: number;

  @Column({ name: 'id_tahun_ajaran' })
  idTahunAjaran: number;

  @Column({ name: 'id_siswa' })
  idSiswa: number;

  @Column({ name: 'id_biaya' })
  idBiaya: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

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

  @ManyToOne(() => RefBiaya)
  @JoinColumn({ name: 'id_biaya' })
  biaya: RefBiaya;
}
