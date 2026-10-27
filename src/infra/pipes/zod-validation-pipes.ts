import {
  PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod/v4";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(error),
          status: 400,
          message: "Validation failed",
        });
      }
      throw new BadRequestException("Validation failed");
    }
  }
}
