import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './services/api-config.service';
import { TranslationService } from './services/translation.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [ApiConfigService, TranslationService],
  exports: [ApiConfigService, TranslationService],
})
export class SharedModule {}
