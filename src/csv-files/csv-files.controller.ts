import { Controller, Get,UploadedFile, Post, UseInterceptors, HttpCode, Body, UsePipes, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer,diskStorage } from 'multer';

import { CreateStatisticValidation } from 'lib/validations/src';
import { CsvFilesService } from 'src/csv-files/csv-files.service';
import { JoiValidationPipe } from 'src/lib/validation.pipe';
import { CreateStatisticDto } from 'types';
import { CsvHttpError } from 'src/lib/errors/http-errors';
import { FileExistencePipe } from 'src/lib/FileExistencePipe';
import { fileUpload } from 'src/lib/file-upload';

@Controller('csv-files')
export class CsvFilesController {
  constructor(private readonly csvFilesService: CsvFilesService) {}


    
  @Post()
  @UseInterceptors(FileInterceptor('file', fileUpload)) 
  @HttpCode(201)
  @UsePipes(FileExistencePipe) // File existence pipe
  async createDynamicTable(
    @UploadedFile() file: Multer.File
  ){
    try {
      const tableName = await this.csvFilesService.createDynamicTable(file.path);

      return {tableName : tableName};
    } catch (e) {
      Logger.error(`Failed createDynamicTable`);
      CsvHttpError.throwHttpErrorFromCsv(e);
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

