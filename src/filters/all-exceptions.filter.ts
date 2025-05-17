import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch, HttpException } from "@nestjs/common";
import type { Response } from "express";
import { I18nService } from "nestjs-i18n";

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    let message: any = exception.getResponse();

    // If the message is an object with a key property, try to translate it
    if (typeof message === 'object' && message !== null && 'key' in message) {
      try {
        const translationKey = message.key as string;
        const args = (message.args || {}) as Record<string, unknown>;

        // Try to translate the message
        const translated = await this.i18n.translate(translationKey, {
          lang: ctx.getRequest().i18nLang || 'en',
          args: args,
        });

        if (translated) {
          message = translated;
        }
      } catch (error) {
        // If translation fails, use the original message
        console.error('Translation error:', error);
      }
    }

    response.status(statusCode).json({ statusCode, message });
  }
}
