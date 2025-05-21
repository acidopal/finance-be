import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';
import { createHash } from 'crypto';

@Entity('adm_user')
export class User {
  @PrimaryGeneratedColumn({ name: 'userid' })
  idUser: number;

  @Column({ length: 50, nullable: false })
  username: string;

  @Column({ length: 50, nullable: false, name: 'alias' })
  alias: string;

  @Column({ length: 100, nullable: false })
  @Exclude()
  password: string;

  @Column({ length: 1, nullable: false, name: 'user_status' })
  userStatus: string;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'id_karyawan', nullable: false })
  idKaryawan: number;

  @Column({ name: 'created_by', length: 20, nullable: false })
  createdBy: string;

  @Column({ type: 'datetime', name: 'created_date', nullable: false })
  createdDate: Date;

  @Column({ name: 'modified_by', length: 20, nullable: true })
  modifiedBy: string;

  @Column({ type: 'datetime', name: 'modified_date', nullable: true })
  modifiedDate: Date;

  // Temporarily disable the roles relationship until we fix the database schema
  roles: Role[] = [];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it's not already hashed
    // MD5 hashes are 32 characters long
    // bcrypt hashes start with '$2a$', '$2b$', or '$2y$'
    if (this.password &&
        this.password.length !== 32 &&
        !this.password.startsWith('$2a$') &&
        !this.password.startsWith('$2b$') &&
        !this.password.startsWith('$2y$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    console.log('Validating password for user:', this.username);
    console.log('Stored password hash:', this.password);

    // Check if the stored password is an MD5 hash (32 characters)
    if (this.password && this.password.length === 32) {
      console.log('Stored password appears to be an MD5 hash');

      // Calculate MD5 hash of the input password using Node.js crypto module
      const inputMd5 = createHash('md5').update(password).digest('hex');
      console.log('Input password MD5:', inputMd5);

      // Compare the MD5 hashes
      const md5Match = inputMd5 === this.password;
      console.log('MD5 comparison result:', md5Match);

      if (md5Match) {
        // If MD5 matches, we can optionally upgrade to bcrypt for future logins
        // Uncomment the following lines to enable automatic upgrade
        // this.password = await bcrypt.hash(password, 10);
        // console.log('Upgraded password to bcrypt hash');
        return true;
      }

      return false;
    }

    // If the stored password is a bcrypt hash
    if (this.password && (
        this.password.startsWith('$2a$') ||
        this.password.startsWith('$2b$') ||
        this.password.startsWith('$2y$')
    )) {
      console.log('Stored password appears to be a bcrypt hash');

      try {
        const bcryptMatch = await bcrypt.compare(password, this.password);
        console.log('Bcrypt comparison result:', bcryptMatch);
        return bcryptMatch;
      } catch (error) {
        console.log('Bcrypt comparison error:', error.message);
        return false;
      }
    }

    // If we reach here, the password format is unknown
    console.log('Unknown password format, cannot validate');
    return false;
  }
}
