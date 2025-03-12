import { 
  Controller,
  UploadedFile,
  Post,
  UseInterceptors,
  HttpCode,
  Body,
  UsePipes,
  Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { CreateStatisticValidation } from 'lib/validations/src';
import { CreateStatisticDto } from 'types';

import { CsvFilesService } from 'src/csv-files/csv-files.service';
import { JoiValidationPipe } from 'src/lib/validation.pipe';
import { CsvHttpError } from 'src/lib/errors/http-errors';
import { FileExistencePipe } from 'src/lib/file-existence-pipe';
import { FileUpload } from 'src/lib/file-upload';


@Controller('csv-files')
export class CsvFilesController {
  constructor(
    private readonly csvFilesService: CsvFilesService,
    @InjectQueue('file-processing') private fileQueue: Queue
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', FileUpload)) 
  @HttpCode(202)
  @UsePipes(FileExistencePipe) // File existence pipe
  async uploadFile(
    @UploadedFile() file: Multer.File
  ) {
    try {
       this.fileQueue.add(
        { filePath: file.path },
        {
          attempts: 5,
          backoff: 5000,
        }
      );
      return { message: 'File uploaded successfully. Processing in background.'};
    } catch (error) {
      Logger.error('Failed to add job to queue', error);
      throw error;
    }
  }

  @Post('/statistic')
  @UsePipes(new JoiValidationPipe(CreateStatisticValidation))
  @HttpCode(201)
  async createStatistic(@Body() body: CreateStatisticDto) {
    try {
      const Statistic = await this.csvFilesService.createStatistic(body);
      return {Statistic : Statistic};
    } catch (e) {
      Logger.error(`Failed createStatistic`);
      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }
}