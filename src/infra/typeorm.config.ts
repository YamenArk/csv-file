import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user';
import { Job } from 'src/lib/entities/job';
import { ConfigService } from './config.service';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: configService.getDatabaseType(),
  host: configService.getDatabaseHostString(),
  port: configService.getDatabasePort(),
  username: configService.getDatabaseUserString(),
  password: configService.getDatabasePasswordString(),
  database: configService.getDatabaseNameString(),
  entities: [User, Job],
  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
});
