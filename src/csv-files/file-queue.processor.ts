import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CsvFilesService } from './csv-files.service';

@Processor('file-processing')
export class FileProcessor {
  constructor(private readonly csvFilesService: CsvFilesService) {}

  @Process()
  async handleFileProcessing(job: Job<{ filePath: string }>) {
    try {
      console.log(`Processing file: ${job.data.filePath}`);
      const tableName = await this.csvFilesService.createDynamicTable(job.data.filePath);
      console.log(`Table created: ${tableName}`);
    } catch (error) {
      console.error('File processing failed:', error);
      throw error;
    }
  }
}