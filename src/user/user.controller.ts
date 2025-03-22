import { 
  Controller,
  Post,
  HttpCode,
  Body,
  Logger, 
  UsePipes} from '@nestjs/common';

import { UserService } from './user.service';
import { CsvHttpError } from 'src/lib/errors/http-errors';
import { JoiValidationPipe } from 'src/lib/validation.pipe';

import { AuthLoginValidation, EmailValidation, FcmValidation, RegistrationValidation } from 'lib/validations/src/user-validations';
import { AuthLoginDto, EmailDto, RegistrationDto, UpdateFcmDto } from 'lib/types/src/dtos/user.interface';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @UsePipes(new JoiValidationPipe(AuthLoginValidation))
  @HttpCode(200)
  async login(
    @Body()authLoginDto: AuthLoginDto
  ) {
    try {
        const loginDetails = await this.userService.login(authLoginDto   );
        return {loginDetails : loginDetails}
       
    } catch (e) {
        Logger.error(`Failed to login - ${e}`);
       CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }

  @Post('registration')
  @UsePipes(new JoiValidationPipe(EmailValidation))
  @HttpCode(201)
  async createStatistic(
    @Body() emailDto: EmailDto
  ) {
    try {
    await this.userService.registration(emailDto);
      return {message : "message send to your mail"};
    } catch (e) {
     Logger.error(`Failed registration - ${e}`);
      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }
  
  @Post('submit-code')
  @UsePipes(new JoiValidationPipe(RegistrationValidation))
  @HttpCode(200)
  async resetPassword(
    @Body() registrationDto: RegistrationDto
  ) {
    try {
        await this.userService.resetPassword(registrationDto);
        return {message : "user Created Successfully"}
        } catch (e) {
         Logger.error(`Failed to sumbmit code - ${e}`);
          CsvHttpError.throwHttpErrorFromCsv(e);
        }
  }

  @Post('fcm-token')
  @UsePipes(new JoiValidationPipe(FcmValidation))
  @HttpCode(202)
  async updateFcmToken(
    @Body() updateFcmDto: UpdateFcmDto
  ) {
    try {
      await this.userService.updateUserFcmToken(updateFcmDto);
      return { message: 'FCM token updated successfully' };
    } catch (e) {
      Logger.error(`Failed to update fcm-token - ${e}`);
      CsvHttpError.throwHttpErrorFromCsv(e);
    }
  }


  
}