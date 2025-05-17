import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_list_uang_masuk')
export class RefListUangMasuk {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ length: 5, name: 'kodedesk', nullable: true })
  kodedesk: string;

  @Column({ name: 'kodesub', nullable: true })
  kodesub: number;

  @Column({ length: 50, name: 'daftarlist', nullable: true })
  daftarlist: string;

  @Column({ length: 100, name: 'keterangan', nullable: true })
  keterangan: string;

  @Column({ length: 20, name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: true })
  createdDate: Date;

  @Column({ length: 20, name: 'modified_by', nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;
}
