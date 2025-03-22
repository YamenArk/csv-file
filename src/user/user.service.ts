import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER,Cache  } from '@nestjs/cache-manager';

import { SqlUserRepository } from 'src/infra/repositories/user-repository';
import { LoginUsecase } from './usecases/login.usecase';
import { ResetPasswordUsecase } from './usecases/reset-password.usecase';
import { RegistrationUsecase } from './usecases/registration.usecase';

import { AuthLoginDto, EmailDto, RegistrationDto, UpdateFcmDto } from 'lib/types/src/dtos/user.interface';
import { UpdateUserFcmTokenUsecase } from './usecases/update-user-fcm-token.usecase';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: SqlUserRepository,
        private jwtService : JwtService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache, 
    ) {}

    async login(authLoginDto : AuthLoginDto) {
        const loginUsecase = new LoginUsecase(this.userRepository,this.jwtService);
        return loginUsecase.execute(authLoginDto)
      }

    async registration(emailDto: EmailDto){
        const registrationUsecase = new RegistrationUsecase(this.userRepository,this.cacheManager);
        return registrationUsecase.execute(emailDto)
    }

    async resetPassword(registrationDto: RegistrationDto){
        const resetPasswordUsecase = new ResetPasswordUsecase(this.userRepository,this.cacheManager);
        return resetPasswordUsecase.execute(registrationDto)
    }

    async updateUserFcmToken(updateFcmDto : UpdateFcmDto){
        const updateUserFcmTokenUsecase = new UpdateUserFcmTokenUsecase(this.userRepository);
        return updateUserFcmTokenUsecase.execute(updateFcmDto)
    }
}