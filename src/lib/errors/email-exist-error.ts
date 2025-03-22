import { CsvError } from '.';

export class EmailExistError extends CsvError {
  constructor() {
    super('email already exist');
  }
}
