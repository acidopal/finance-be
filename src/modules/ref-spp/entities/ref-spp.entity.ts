import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('ref_spp')
export class RefSpp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, name: 'ref_name', nullable: true })
  refName: string;

  @Column({ nullable: true })
  besarnya: number;

  @Column({ length: 10, name: 'tahun_ajaran', nullable: true })
  tahunAjaran: string;

  @Column({ length: 10, nullable: true })
  kodedesk: string;

  @Column({ length: 10, nullable: true })
  kodesub: string;

  @Column({ length: 20, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date' })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
