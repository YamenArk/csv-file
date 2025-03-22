import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

import { UnauthorizedError } from 'src/lib/errors/unauthorized-error';
import { UserNotFoundError } from 'src/lib/errors/user-error';

import {  Usecase, UserRepository   } from 'lib/types/src/index';
import { AuthLoginDto } from 'lib/types/src/dtos/user.interface';

export class LoginUsecase implements Usecase<AuthLoginDto, Promise<{ access_token: string }>> {
  constructor(
        private userRepository: UserRepository,
        private jwtService : JwtService,
  ) {}

  async execute(authLoginDto: AuthLoginDto):  Promise<{ access_token: string }> {
    const user = await this.userRepository.getUserByEmail(authLoginDto.email);
    if (!user) {
      throw new UserNotFoundError(); 
    }
    const isMatch = await this.isPasswordMatch(authLoginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError();
    }
    
    if (authLoginDto.fcmToken) {
      await this.userRepository.updateUserFcmToken(user.id, authLoginDto.fcmToken);
    }

    const payload = {
    userId: user.id,
    };
    return {
    access_token: this.jwtService.sign(payload),
    };
  }
  
  private async isPasswordMatch(loginPassword,userPassword){
    return bcrypt.compare(loginPassword,userPassword); 
  }
}
