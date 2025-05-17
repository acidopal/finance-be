import { Module } from '@nestjs/common';
import { ChangePassController } from './change-pass.controller';
import { ChangePassService } from './change-pass.service';
import { AdmUserModule } from '../adm-user/adm-user.module';

@Module({
  imports: [AdmUserModule],
  controllers: [ChangePassController],
  providers: [ChangePassService],
})
export class ChangePassModule {}
