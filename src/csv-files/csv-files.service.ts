import { Injectable } from '@nestjs/common';

import { CreateStatisticDto } from 'types';

import { SqlCsvRepository } from 'src/infra/repositories/csv-repository';
import { CreateDynamicTableUsecase } from './usecases/create-dynamic-table.usecase';
import { CreateStatisticUsecase } from './usecases/create-statistic.usecase';

@Injectable()
export class CsvFilesService {
    constructor(
        private readonly sqlCsvRepository : SqlCsvRepository) {}

    async createDynamicTable(filePath : string) {
        const createDynamicTableUsecase = new CreateDynamicTableUsecase(this.sqlCsvRepository);
        return createDynamicTableUsecase.execute(filePath)
      }

    async createStatistic(data: CreateStatisticDto){
        const createStatisticUsecase = new CreateStatisticUsecase(this.sqlCsvRepository);
        return createStatisticUsecase.execute(data)
    }
}