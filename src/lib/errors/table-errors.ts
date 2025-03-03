import { CsvError } from '.';

export class TableNotFoundError extends CsvError {
  constructor() {
    super('table not found');
  }
}
