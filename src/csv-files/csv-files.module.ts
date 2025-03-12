import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { CsvFilesService } from './csv-files.service';
import { CsvFilesController } from './csv-files.controller';
import { InfraModule } from 'src/infra/infra.module';
import { FileProcessor } from './file-queue.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    InfraModule,
    BullModule.registerQueue({
      name: 'file-processing',
    }),
  ], 
  providers: [CsvFilesService,FileProcessor],
  controllers: [CsvFilesController]
})
export class CsvFilesModule {}