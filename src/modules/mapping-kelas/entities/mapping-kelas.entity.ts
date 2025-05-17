import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefKaryawan } from '../../ref-karyawan/entities/ref-karyawan.entity';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';
import { RefJur } from '../../ref-jur/entities/ref-jur.entity';

@Entity('ref_mapping_kelas')
export class MappingKelas {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ length: 20, nullable: false })
  kelas: string;

  @Column({ name: 'ruang_kelas', length: 20, nullable: false })
  ruangKelas: string;

  @Column({ name: 'id_karyawan', nullable: false })
  idKaryawan: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'id_jur', nullable: false })
  idJur: number;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @ManyToOne(() => RefKaryawan)
  @JoinColumn({ name: 'id_karyawan' })
  karyawan: RefKaryawan;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;

  @ManyToOne(() => RefJur)
  @JoinColumn({ name: 'id_jur' })
  jur: RefJur;
}
