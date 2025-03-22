import { 
  Controller,
  HttpCode,
  Logger, 
  Request,
  Get,
  Param,
  UseGuards} from '@nestjs/common';

import { CsvHttpError } from 'src/lib/errors/http-errors';
import { JobService } from './job.service';
import { AuthGuard } from 'src/lib/auth/auth.guard';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly jserService: JobService,
  ) {}

    @Get('getJobs/:status')
    @UseGuards(AuthGuard) 
    @HttpCode(202)
    async getJobs(
    @Request() req,
    @Param('status') status: string
    ){
    try {
        req.user.userId
        const jobs = await this.jserService .getJobs(req.user.userId,status);
        return {jobs : jobs};
    } catch (e) {
        Logger.error(`Failed createStatistic`);
        CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }
}