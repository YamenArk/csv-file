import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CsvFilesModule } from './csv-files/csv-files.module';
import { InfraModule } from './infra/infra.module';
import { ConfigService } from 'src/infra/config.service';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { getTypeOrmConfig } from './infra/typeorm.config';
import { BullConfig } from './infra/bull-config';


@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [InfraModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => BullConfig.getRedisConfig(configService),
    }),
    TypeOrmModule.forRootAsync({
      imports: [InfraModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,  
    }),
    JobModule,
    UserModule,
    CsvFilesModule,
    InfraModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
