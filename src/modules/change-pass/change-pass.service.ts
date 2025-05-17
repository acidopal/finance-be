import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdmUserService } from '../adm-user/adm-user.service';
import * as crypto from 'crypto';

@Injectable()
export class ChangePassService {
  constructor(private admUserService: AdmUserService) {}

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    // Validate that new password and confirm password match
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Get the user
    const user = await this.admUserService.findOne(userId);

    // Verify current password
    const hashedCurrentPassword = crypto
      .createHash('md5')
      .update(changePasswordDto.currentPassword)
      .digest('hex');

    if (user.password !== hashedCurrentPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Update the password
    await this.admUserService.update(
      userId,
      { password: changePasswordDto.newPassword },
      user.username,
    );
  }
}
