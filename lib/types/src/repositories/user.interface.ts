import { RegistrationDto } from '../dtos/user.interface';
import { UserEntity } from '../entities/user';

export interface UserRepository{
    getUserById(userId : number):Promise<UserEntity>;
    getUserByEmail(email : string):Promise<UserEntity>;
    createUser(input: Omit<RegistrationDto, 'code'>):Promise<void>;
    updateUserFcmToken(id: number, fcmToken: string):Promise<void>;
}
