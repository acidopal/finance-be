import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RefSmk } from '../../ref-smk/entities/ref-smk.entity';

@Entity('ref_list_biaya')
export class RefListBiaya {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'id_smk', nullable: false })
  idSmk: number;

  @Column({ nullable: false })
  kelas: number;

  @Column({ name: 'jenispembayaran', length: 60, nullable: true })
  jenisPembayaran: string;

  @Column({ nullable: false })
  dicicil: number;

  @Column({ name: 'dana_opsional', nullable: false, default: 0 })
  danaOpsional: number;

  @Column({ length: 20, nullable: false })
  periode: string;

  @Column({ type: 'float', precision: 9, scale: 0, nullable: true })
  besarnya: number;

  @Column({ name: 'tahun_ajaran', length: 11, nullable: true })
  tahunAjaran: string;

  @Column({ name: 'id_coa', nullable: false })
  idCoa: number;

  @Column({ name: 'jenis_transaksi', nullable: true })
  jenisTransaksi: number;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: true })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  @ManyToOne(() => RefSmk)
  @JoinColumn({ name: 'id_smk' })
  smk: RefSmk;
}
