import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';

@Entity('ref_spp_type')
export class RefSppType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ref_name', length: 30, nullable: false })
  refName: string;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'tahun_ajaran', length: 10, nullable: false })
  tahunAjaran: string;

  @Column({ name: 'type_dis', nullable: false })
  typeDis: number;

  @Column({ type: 'float', nullable: false })
  besarnya: number;

  @Column({ length: 30, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 30, name: 'modified_by', nullable: false })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: false })
  modifiedDate: Date;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;
}
