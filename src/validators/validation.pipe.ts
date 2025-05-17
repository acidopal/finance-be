/* eslint-disable no-await-in-loop */
import type { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { TranslationService } from "../shared/services/translation.service";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly translationService: TranslationService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    // console.log("object ", object);
    const errors = await validate(object);
    let errorConstraints: string[] = [];

    if (errors.length > 0) {
      for (const error of errors) {
        // VALIDATE ARRAY OF OBJECTS
        if ("children" in error) {
          if (error.children!.length > 0) {
            for (const child of error.children!) {
              if ("children" in child && child.children!.length > 0) {
                for (const childChild of child.children!) {
                  const errorMessage = Object.keys(childChild.constraints!).map(
                    (key) => childChild.constraints![key]
                  );
                  errorConstraints = [...errorConstraints, ...errorMessage];
                }
              }
            }
          }
          // VALIDATE OBJECTS
        } else {
          const errorMessage = Object.keys(error.constraints!).map(
            (key) => error.constraints![key]
          );
          console.log("-errorMessage ", errorMessage);
          errorConstraints = [...errorConstraints, ...errorMessage];
        }
      }

      if (errorConstraints.length > 0) {
        const detailMessage: string[] = [];
        console.log("-detailMessage ", detailMessage);

        for (const errorConstraint of errorConstraints) {
          const translatedErrorConstraint =
            await this.translationService.translate(errorConstraint);
          detailMessage.push(translatedErrorConstraint);
        }

        const failedStatus = await this.translationService.translate(
          "message._failed"
        );

        throw new BadRequestException({
          status: failedStatus,
          detail: detailMessage,
          error: new BadRequestException().message,
        });
      }
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
