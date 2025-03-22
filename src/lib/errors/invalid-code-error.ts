import { CsvError } from '.'; 

export class InvalidResetCodeError extends CsvError {
  constructor() {
    super('Invalid reset code for the provided email');
  }
}
