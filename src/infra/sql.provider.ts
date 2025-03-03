import { FactoryProvider, Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

import { DI_VARIABLES } from '../di';
import { ConfigService } from './config.service';

const provider: FactoryProvider = {
  provide: DI_VARIABLES.DB,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    try {
      const connection = await mysql.createConnection({
        host: configService.getDatabaseHostString(),
        user: configService.getDatabaseUserString(),
        password: configService.getDatabasePasswordString(),
        database: configService.getDatabaseNameString(),
      });

      Logger.log('Connected to MySQL database');
      return connection;
    } catch (error) {
      Logger.error('Failed to connect to MySQL:', error);
      throw error;
    }
  },
};

export default provider;
