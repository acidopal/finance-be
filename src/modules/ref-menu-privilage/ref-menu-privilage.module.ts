import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefMenuPrivilage } from './entities/ref-menu-privilage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefMenuPrivilage])],
  exports: [TypeOrmModule],
})
export class RefMenuPrivilageModule {}
