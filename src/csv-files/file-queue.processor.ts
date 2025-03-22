import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';

import { CsvFilesService } from './csv-files.service';
import { FirebaseService } from 'src/lib/notifications/firebase/firebase.service';
import { CsvHttpError } from 'src/lib/errors/http-errors';
import { NotificationMessages } from 'src/lib/notifications/messages/notification-messages';
import { MailService } from 'src/lib/notifications/email/mail.service';
import { JobRepository } from 'lib/types/src/repositories/job.interface';
import { UserRepository } from 'lib/types/src/repositories/user.interface';

@Processor('file-processing')
export class FileProcessor {
  private readonly logger = new Logger(FileProcessor.name);

  constructor(
    private readonly csvFilesService: CsvFilesService,
    @Inject('USER_REPO') private readonly userRepository: UserRepository,
    @Inject('JOB_REPO') private readonly jobRepository: JobRepository,
    private readonly firebaseService: FirebaseService,  
    private readonly mailService: MailService,  
  ) {}

  @Process()
  async handleFileProcessing(job: Job<{ filePath: string; userId: number; jobId?: number }>) {
    let jobId = await this.ensureJobId(job);
    let user: {email :string , fcmToken?: string } | null = null;

    try {
      this.logger.log(`Processing file: ${job.data.filePath}`);

      user = await this.userRepository.getUserById(job.data.userId);

      const tableName = await this.csvFilesService.createDynamicTable(job.data.filePath);

      await this.updateJobStatus(jobId, tableName);

      // await this.sendJobCompletionNotification(user.email,user?.fcmToken);
    } catch (e) {
      this.logger.error("File processing failed:", e);

      if (this.isFinalAttempt(job)) {
        this.logger.log(`Final attempt (${job.attemptsMade + 1}/${job.opts.attempts}). Updating job status.`);

        if (jobId) {
          await this.jobRepository.updateJobStatus(jobId, "failed");
        }

        await this.sendJobFailureNotification(user.email,user?.fcmToken);
      } else {
        this.logger.log(`Retrying job... (${job.attemptsMade + 1}/${job.opts.attempts})`);
      }

      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }

  private isFinalAttempt(job: Job): boolean {
    return job.attemptsMade + 1 >= job.opts.attempts;
  }
  
  private async ensureJobId(job: Job<{ userId: number; jobId?: number }>): Promise<number> {
    if (job.data.jobId) {
      return job.data.jobId; 
    }

    const newJobId = await this.jobRepository.createJob(job.data.userId);
    job.data.jobId = newJobId;

    await job.update(job.data);
    
    return newJobId;
  }

  private async updateJobStatus(jobId: number, tableName: string): Promise<void> {
    const jobStatus = await this.jobRepository.getJobStatus(jobId);
    if (jobStatus !== 'success') {
      await this.jobRepository.updateJobStatus(jobId, 'success');
      await this.jobRepository.updateJobFile(jobId, tableName);
    }
  }

 

  private async sendJobCompletionNotification(email : string,fcmToken?: string): Promise<void> {
    try{
      const message = NotificationMessages.getJobCompletionMessage();
      await this.mailService.sendMail(email, message.title, message.body); 
      if (fcmToken) {
        await this.firebaseService.sendNotification(fcmToken, message.title, message.body);
      }
    }catch (notificationError) {
      this.logger.warn("Notification failed, but job is successful:", notificationError);
    }
  }
  
  private async sendJobFailureNotification(email: string,fcmToken?: string): Promise<void> {
    try {
      const message = NotificationMessages.getJobFailureMessage();
      await this.mailService.sendMail(email, message.title, message.body); 
      if (fcmToken) {
        await this.firebaseService.sendNotification(fcmToken, message.title, message.body);
      }
    } catch (notificationError) {
      this.logger.error("Failed to send failure notification:", notificationError);
    }
  }
}