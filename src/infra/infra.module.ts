import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import  SqlProvider  from './sql.provider';
import { SqlCsvRepository } from './repositories/csv-repository';

@Module({
    imports: [],
    controllers: [],
    providers: [ConfigService, SqlProvider, SqlCsvRepository],
    exports: [ConfigService, SqlProvider, SqlCsvRepository],
})
export class InfraModule {}
