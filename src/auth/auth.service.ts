import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('Validating user:', username);

    const user = await this.usersRepository.findOne({
      where: { username }
    });

    if (!user) {
      console.log('User not found:', username);
      return null;
    }

    console.log('User found:', user.username);

    const isValid = await user.validatePassword(password);
    console.log('Password validation result:', isValid);

    if (isValid) {
      // Update modified date
      user.modifiedDate = new Date();

      // Save the user to update the modified_date and potentially the password
      // if it was upgraded from MD5 to bcrypt
      await this.usersRepository.save(user);
      console.log('User updated with new modified_date and potentially new password hash');

      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.idUser,
      username: user.username,
      roles: ['user'] // Default role since we don't have roles in the database yet
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.idUser,
        username: user.username,
        alias: user.alias,
        userStatus: user.userStatus,
        roleId: user.roleId,
        idKaryawan: user.idKaryawan,
        createdBy: user.createdBy,
        createdDate: user.createdDate,
        modifiedBy: user.modifiedBy,
        modifiedDate: user.modifiedDate,
        roles: ['user'] // Default role since we don't have roles in the database yet
      }
    };
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { idUser: id }
    }).catch(() => {
      throw new UnauthorizedException('User not found');
    });

    return user;
  }
}
