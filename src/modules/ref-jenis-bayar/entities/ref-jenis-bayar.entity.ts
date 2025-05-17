import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_jenis_bayar')
export class RefJenisBayar {
  @PrimaryGeneratedColumn({ name: 'id_jenis_bayar' })
  idJenisBayar: number;

  @Column({ length: 30, nullable: false })
  jenis: string;

  @Column({ type: 'text', nullable: false })
  keterangan: string;

  @Column({ nullable: false })
  flag: number;
}
