import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';

@Entity('ref_komponen_cicilan')
export class RefKomponenCicilan {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ name: 'no_type', nullable: false })
  noType: number;

  @Column({ name: 'id_coa', nullable: false })
  idCoa: number;

  @Column({ name: 'jenis_pembayaran', length: 30, nullable: true })
  jenisPembayaran: string;

  @Column({ type: 'float', precision: 9, scale: 0, nullable: true })
  besarnya: number;

  @Column({ name: 'tahun_ajaran', length: 11, nullable: true })
  tahunAjaran: string;

  @Column({ length: 20, name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @Column({ name: 't_awal', type: 'date', nullable: false })
  tAwal: Date;

  @Column({ name: 't_akhir', type: 'date', nullable: false })
  tAkhir: Date;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;
}
