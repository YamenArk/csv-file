import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from './config.service';
import  SqlProvider  from './sql.provider';
import { SqlCsvRepository } from './repositories/csv-repository';
import { SqlJobRepository } from './repositories/job-repository';
import { SqlUserRepository } from './repositories/user-repository';
import { User } from 'src/lib/entities/user';
import { Job } from 'src/lib/entities/job';

@Module({
    imports: [
          TypeOrmModule.forFeature([
              User,
              Job
            ]),
    ],
    controllers: [],
    providers: [ConfigService, SqlProvider, SqlCsvRepository,SqlJobRepository,SqlUserRepository],
    exports: [ConfigService, SqlProvider, SqlCsvRepository,SqlJobRepository,SqlUserRepository],
})
export class InfraModule {}
