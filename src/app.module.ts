import { Module } from '@nestjs/common';

import { CsvFilesModule } from './csv-files/csv-files.module';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [
    CsvFilesModule,
    InfraModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
