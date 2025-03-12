import {
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  
  import { CsvError } from '.';
import { TableNotFoundError } from './table-errors';
  
  export abstract class CsvHttpError {
    static throwHttpErrorFromCsv(error: CsvError) {
      if (error instanceof TableNotFoundError) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }
  