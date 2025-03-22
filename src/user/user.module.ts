import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { InfraModule } from 'src/infra/infra.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/lib/entities/user';
import { Job } from 'src/lib/entities/job';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Job
    ]),
    InfraModule,
    CacheModule.register({
    }),
    BullModule.registerQueue({
      name: 'file-processing',
    }),
    JwtModule.registerAsync({
        imports :[ConfigModule],
        useFactory :async () => ({
          secret : process.env.JWT_SECRET
          ,signOptions: { expiresIn: '1d' },
        }),
        inject : [ConfigService]
      }),
  ], 
  providers: [
    UserService,
  ],
  controllers: [UserController]
})
export class UserModule {}