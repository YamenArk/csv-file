import {  Injectable } from "@nestjs/common";
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {JobRepository } from 'lib/types/src/index';
import { JobEntity } from 'lib/types/src/entities/job';

import { Job } from 'src/lib/entities/job';

@Injectable()
export class SqlJobRepository implements JobRepository {
    constructor(
        @InjectRepository(Job)
        private readonly jobsRepository: Repository<Job>,
    ){}

    async createJob(userId : number):Promise<number>{
        const job = await this.jobsRepository.create({
            status : 'pending',
            user :{id : userId},
        })
        const savedJob = await this.jobsRepository.save(job);
        return savedJob.id;
    }

    async updateJobFile(jobId : number , fileName : string):Promise<void>{
        await this.jobsRepository.update(jobId, { fileName });
    }

    async updateJobStatus(jobId : number , status : string):Promise<void>{
        if (status === 'success' || status === 'failed') {
            await this.jobsRepository.update(jobId, { status });
          }
    }
    
    async getSuccessJobs(userId: number):Promise<JobEntity[]>{
        return this.jobsRepository.find({
            where :{
                user :{
                    id : userId
                },
                status : 'success'
            }
        })
    }

    async getfailedJobs(userId: number):Promise<JobEntity[]>{
        return this.jobsRepository.find({
            where :{
                user :{
                    id : userId
                },
                status : 'failed'
            }
        })
    }

    async getJobs(userId: number):Promise<Omit<JobEntity[], 'user'>>{
        return this.jobsRepository.find({
            where :{
                user :{
                    id : userId
                },
            }
        })
    }

    async getJobStatus(id : number):Promise <string>{
        const job = await this.jobsRepository.findOne({
            where :{
                id 
            }
        })
        return job.status
    }
}