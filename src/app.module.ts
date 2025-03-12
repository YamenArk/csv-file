import { Module } from '@nestjs/common';

import { CsvFilesModule } from './csv-files/csv-files.module';
import { InfraModule } from './infra/infra.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CsvFilesModule,
    InfraModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
