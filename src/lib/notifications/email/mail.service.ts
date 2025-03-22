import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { MailConfig } from './mail.config';
import { ConfigService } from 'src/infra/config.service';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      MailConfig.getMailTransportOptions(this.configService),
    );
  }

  async sendMail(to: string, subject: string, message: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.getMailUsername(),
      to,
      subject,
      text: message,
    });
  }
}
