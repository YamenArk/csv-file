import { ConfigService } from "src/infra/config.service";

export class MailConfig {
  static getMailTransportOptions(configService: ConfigService) {
    return {
      host: configService.getMailHost(),
      port: configService.getMailPort(),
      secure: false,
      auth: {
        user: configService.getMailUsername(),
        pass: configService.getMailPassword(),
      },
    };
  }
}
