import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity('adm_roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  role_name: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_date: Date;

  @Column({ length: 50, nullable: true })
  created_by: string;

  @UpdateDateColumn()
  modified_date: Date;

  @Column({ length: 50, nullable: true })
  modified_by: string;

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
