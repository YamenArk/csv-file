import {
  BadRequestException,
  ConflictException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  
import { CsvError } from '.';
import { TableNotFoundError } from './table-errors';
import { UserNotFoundError } from './user-error';
import { UnauthorizedError } from './unauthorized-error';
import { EmailExistError } from './email-exist-error';
import { InvalidResetCodeError } from './invalid-code-error';
  
  export abstract class CsvHttpError {
    static throwHttpErrorFromCsv(error: CsvError) {
      if (error instanceof TableNotFoundError || error instanceof UserNotFoundError) {
        throw new NotFoundException();
      }
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException();
      }
      if (error instanceof EmailExistError) {
        throw new ConflictException();
      }
      if (error instanceof InvalidResetCodeError) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  }
  