import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InfraModule } from 'src/infra/infra.module';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { AuthModule } from 'src/lib/auth/auth.module';
import { Job } from 'src/lib/entities/job';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Job
    ]),
    InfraModule,
  ], 
  providers: [
    JobService,
  ],
  controllers: [JobController]
})
export class JobModule {}