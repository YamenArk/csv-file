import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';

import { CsvFilesService } from './csv-files.service';
import { CsvFilesController } from './csv-files.controller';
import { InfraModule } from 'src/infra/infra.module';
import { FileProcessor } from './file-queue.processor';
import { AuthModule } from 'src/lib/auth/auth.module';
import { FirebaseService } from 'src/lib/notifications/firebase/firebase.service';
import { User } from 'src/lib/entities/user';
import { Job } from 'src/lib/entities/job';
import { NotificationMessages } from 'src/lib/notifications/messages/notification-messages';
import { MailService } from 'src/lib/notifications/email/mail.service';
import { SqlJobRepository } from 'src/infra/repositories/job-repository';
import { SqlUserRepository } from 'src/infra/repositories/user-repository';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule
import { JwtConfigService } from 'src/lib/auth/jwt-config-service';
import { jwtConfig } from 'src/lib/auth/jwt.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      Job
    ]),
    JwtModule.register({
      global: true,
      secret:  process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    AuthModule,
    InfraModule,
    BullModule.registerQueue({
      name: 'file-processing',
    }),
  ], 
  providers: [
    FirebaseService,
    CsvFilesService,
    FileProcessor,
    NotificationMessages,
    MailService,
    JwtConfigService,
    {
      provide: 'JOB_REPO',
      useClass: SqlJobRepository, 
    },
    {
      provide: 'USER_REPO',
      useClass: SqlUserRepository, 
    },
  ],
  controllers: [CsvFilesController]
})
export class CsvFilesModule {}