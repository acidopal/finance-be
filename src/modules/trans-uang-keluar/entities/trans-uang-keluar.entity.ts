import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trans_uang_keluar')
export class TransUangKeluar {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ length: 5, nullable: true })
  kodedesk: string;

  @Column({ length: 10, nullable: true })
  kodesub: string;

  @Column({ type: 'date', nullable: true })
  tanggaltransaksi: Date;

  @Column({ type: 'float', precision: 10, scale: 0, nullable: true })
  besarnya: number;

  @Column({ length: 30, nullable: true })
  diserahkan: string;

  @Column({ length: 30, nullable: true })
  diterima: string;

  @Column({ length: 100, nullable: true })
  keterangan: string;

  @Column({ type: 'date', nullable: true })
  tanggalinput: Date;

  @Column({ length: 10, nullable: true })
  tahunajaran: string;

  @Column({ length: 10, nullable: true })
  status: string;

  @Column({ length: 50, nullable: true })
  no: string;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'date', name: 'created_date', nullable: true })
  createdDate: Date;
}
