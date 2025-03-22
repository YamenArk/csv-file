import { 
  Controller,
  UploadedFile,
  Post,
  UseInterceptors,
  HttpCode,
  Body,
  UsePipes,
  Logger, 
  Request,
  UseGuards
 } from '@nestjs/common';
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
import { AuthGuard } from 'src/lib/auth/auth.guard';

@Controller('csv-files')
export class CsvFilesController {
  constructor(
    private readonly csvFilesService: CsvFilesService,
    @InjectQueue('file-processing') private fileQueue: Queue
  ) {}

  @Post()
  @UseGuards(AuthGuard) 
  @UseInterceptors(FileInterceptor('file', FileUpload)) 
  @HttpCode(202)
  @UsePipes(FileExistencePipe) // File existence pipe
  async uploadFile(
    @UploadedFile() file: Multer.File,
    @Request() req
  ) {
    try {
        this.fileQueue.add(
        { filePath: file.path,
          userId : req.user.userId
         },
        {
          attempts: 5,
          backoff: 5000,
        }
      );
      return { message: 'File uploaded successfully. Processing in background.'};
    } catch (e) {
      Logger.error('Failed to add job to queue', e);
      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }

  @Post('/statistic')
  @UsePipes(new JoiValidationPipe(CreateStatisticValidation))
  @HttpCode(201)
  async createStatistic(@Body() body: CreateStatisticDto) {
    try {
      const statistic = await this.csvFilesService.createStatistic(body);
      return {statistic : statistic};
    } catch (e) {
      Logger.error(`Failed createStatistic`);
      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }

}