import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Selamat datang di API Finance Pesat! - Versi 1.0';
  }
}
