import { JobEntity } from 'lib/types/src/entities/job';
import {  UsecaseTowInput, JobRepository   } from 'lib/types/src/index';

export class GetJobsUsecase implements UsecaseTowInput<number,string,Promise<JobEntity[]> > {
  constructor(private jobRepository: JobRepository) {}

  async execute(userId: number,status: string):Promise<JobEntity[]> {
    if(status =='success')
    {
      return this.jobRepository.getSuccessJobs(userId)
    }

    else if(status =='failed')
    {
      return this.jobRepository.getfailedJobs(userId)
    }

    else{
      return this.jobRepository.getJobs(userId)
    }

  }
}