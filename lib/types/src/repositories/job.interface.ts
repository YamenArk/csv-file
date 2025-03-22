import { JobEntity } from "../entities/job";

export interface JobRepository{
    createJob(userId : number):Promise<number>;
    updateJobFile(jobId : number , fileName : string):Promise<void>;
    updateJobStatus(jobId : number , status : string):Promise<void>;
    getSuccessJobs(userId: number):Promise<Omit<JobEntity[], 'user'>>;
    getfailedJobs(userId: number):Promise<Omit<JobEntity[], 'user'>>;
    getJobs(userId: number):Promise<Omit<JobEntity[], 'user'>>;
    getJobStatus(id : number):Promise <string>;
}