import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';

@Entity('ref_kelas')
export class RefKelas {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ nullable: false })
  kelas: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;
}
