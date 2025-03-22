import { CsvError } from '.';

export class UserNotFoundError extends CsvError {
  constructor() {
    super('user not found');
  }
}
