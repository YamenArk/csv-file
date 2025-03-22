import { FactoryProvider, Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

import { DI_VARIABLES } from '../di';
import { ConfigService } from './config.service';
import { CsvHttpError } from 'src/lib/errors/http-errors';

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
    } catch (e) {
      Logger.error('Failed to connect to MySQL:', e);
      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  },
};
export default provider;
