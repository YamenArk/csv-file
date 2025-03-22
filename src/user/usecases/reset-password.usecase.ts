import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs'

import { EmailExistError } from 'src/lib/errors/email-exist-error';
import { InvalidResetCodeError } from 'src/lib/errors/invalid-code-error';

import {  Usecase, UserRepository   } from 'lib/types/src/index';
import { RegistrationDto } from 'lib/types/src/dtos/user.interface';

export class ResetPasswordUsecase implements Usecase<RegistrationDto,Promise<void>  > {
  
  constructor(
    private userRepository: UserRepository,
    private readonly cacheManager: any, 
  ) {}

  async execute(registrationDto: RegistrationDto): Promise<void> {
    const cacheKey = this.generateCacheKey(registrationDto.email);
    await this.validateResetCode(cacheKey, registrationDto.code);
    await this.ensureUserDoesNotExist(registrationDto.email);

    const hashedPassword = await this.hashPassword(registrationDto.password);
    console.log(hashedPassword)
    await this.createUser(registrationDto, hashedPassword);
    await this.cacheManager.del(cacheKey);
  }
  
  private generateCacheKey(email: string): string {
    return crypto.createHash('sha256').update(email).digest('hex');
  }

  private async validateResetCode(cacheKey: string, providedCode: number  ): Promise<void> {
    const cachedCode = await this.cacheManager.get(cacheKey);
    if (!cachedCode || cachedCode !== providedCode) {
      throw new InvalidResetCodeError();
    }
  }
  
  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new EmailExistError();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async createUser(registrationDto: RegistrationDto, hashedPassword: string): Promise<void> {
    await this.userRepository.createUser({
      email: registrationDto.email,
      password: hashedPassword,
      username: registrationDto.username,
    });
  }
}
