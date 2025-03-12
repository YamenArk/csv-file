import {  Usecase,CsvRepository, CreateStatisticDto   } from 'lib/types/src/index';
import { TableNotFoundError } from 'src/lib/errors/table-errors';

export class CreateStatisticUsecase implements Usecase<CreateStatisticDto,Promise<string>  > {
  constructor(private csvRepository: CsvRepository) {}

  async execute(data: CreateStatisticDto): Promise<string> {
    const tableExist = await this.csvRepository.getTableByName(data.tableName);
    if (!tableExist) {
      throw new TableNotFoundError();
    }
    return await this.csvRepository.CreateStatistic(data.tableName);
  }
}
