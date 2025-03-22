import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthGuard } from './auth.guard';
import { JwtConfigService } from 'src/lib/auth/jwt-config-service';

@Module({
    imports :[
            ConfigModule,
      ],
      providers: [JwtConfigService,AuthGuard],
      exports: [JwtConfigService,AuthGuard], 
    })
    export class AuthModule {}
