import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmConfigController } from './adm-config.controller';
import { AdmConfigService } from './adm-config.service';
import { AdmConfig } from './entities/adm-config.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmConfig]),
    CommonModule,
  ],
  controllers: [AdmConfigController],
  providers: [AdmConfigService],
  exports: [AdmConfigService],
})
export class AdmConfigModule {}
