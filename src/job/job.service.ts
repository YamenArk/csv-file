import {  Injectable } from '@nestjs/common';

import { GetJobsUsecase } from './usecases/get-jobs-usecase';
import { SqlJobRepository } from 'src/infra/repositories/job-repository';

@Injectable()
export class JobService {
    constructor(
        private readonly jobRepository: SqlJobRepository,
    ) {}
    async getJobs(userId: number, status: string){
        const getJobsUsecase = new GetJobsUsecase(this.jobRepository);
        return getJobsUsecase.execute(userId,status)
    }
}