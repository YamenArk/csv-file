import { ConfigService } from './config.service';

export class BullConfig {
  static getRedisConfig(configService: ConfigService) {
    return {
      redis: {
        host: configService.getRedisHost(),
        port: configService.getRedisPort(),
      },
    };
  }
}
