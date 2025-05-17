import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';

@Entity('ref_jur')
export class RefJur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'nama_jurusan', length: 50, nullable: false })
  namaJurusan: string;

  @Column({ type: 'text', nullable: false })
  info: string;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;
}
