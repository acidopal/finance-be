import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  created_date: Date;

  @Column({ length: 50, nullable: true })
  created_by: string;

  @UpdateDateColumn()
  modified_date: Date;

  @Column({ length: 50, nullable: true })
  modified_by: string;
}
