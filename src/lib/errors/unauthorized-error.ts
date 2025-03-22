import { CsvError } from '.';

export class UnauthorizedError extends CsvError {
  constructor() {
    super('Invalid credentials');
  }
}
