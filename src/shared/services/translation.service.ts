import { Injectable } from '@nestjs/common';
import { isArray, isString, map } from 'lodash';

@Injectable()
export class TranslationService {
  constructor() {}

  async translate(key: string, options?: any): Promise<string> {
    // For now, just return the key as is
    // In a real implementation, this would use i18n or similar
    return key;
  }

  async translateNecessaryKeys<T extends Record<string, any>>(dto: T): Promise<T> {
    // This is a simplified version that just returns the object as is
    return dto;
  }
}
