import { Module } from '@nestjs/common';
import { CsvFilesService } from './csv-files.service';
import { CsvFilesController } from './csv-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    InfraModule
  ], 
  providers: [CsvFilesService],
  controllers: [CsvFilesController]
})
export class CsvFilesModule {}
