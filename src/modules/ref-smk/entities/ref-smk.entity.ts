import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ref_smk')
export class RefSmk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  name: string;
}
