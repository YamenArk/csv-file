import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

import { UnauthorizedError } from 'src/lib/errors/unauthorized-error';
import { UserNotFoundError } from 'src/lib/errors/user-error';

import {  Usecase, UserRepository   } from 'lib/types/src/index';
import { AuthLoginDto, UpdateFcmDto } from 'lib/types/src/dtos/user.interface';

export class UpdateUserFcmTokenUsecase implements Usecase<UpdateFcmDto, Promise<void> >{
  constructor(
        private userRepository: UserRepository,
  ) {}

  async execute(updateFcmDto: UpdateFcmDto):  Promise<void> {
    await this.userRepository.updateUserFcmToken(updateFcmDto.userId,updateFcmDto.fcmToken);
    return
  }
}
