import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChangePassService } from './change-pass.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('change-pass')
@Controller('change-pass')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChangePassController {
  constructor(private readonly changePassService: ChangePassService) {}

  @Post()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password has been successfully changed.' })
  @ApiResponse({ status: 400, description: 'New password and confirm password do not match.' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect.' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    await this.changePassService.changePassword(req.user.userId, changePasswordDto);
    return { message: 'Password has been successfully changed' };
  }
}
