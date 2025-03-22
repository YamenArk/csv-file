import * as crypto from 'crypto';

import { EmailExistError } from 'src/lib/errors/email-exist-error';

import {  Usecase, UserRepository   } from 'lib/types/src/index';
import { EmailDto } from 'lib/types/src/dtos/user.interface';

export class RegistrationUsecase implements Usecase<EmailDto,Promise<void>  > {
  constructor(
        private userRepository: UserRepository,
        private readonly cacheManager: any, 
  ) {}

  async execute(emailDto: EmailDto): Promise<void> {
    this.ensureEmailDoesNotExist(emailDto.email)
    const code = Math.floor(10000 + Math.random() * 90000);
    const message = `Please reset your password using this code: ${code}`;
    console.log(message)
    const cacheKey = crypto.createHash('sha256').update(emailDto.email).digest('hex');
    await this.cacheManager.set(cacheKey, code, { ttl: 300 });
  }
  
  private async ensureEmailDoesNotExist(email){
    const user = await this.userRepository.getUserByEmail(email);
    if (user) {
        throw new EmailExistError();
    }
  }
}
