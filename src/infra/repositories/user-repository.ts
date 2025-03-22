import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {UserRepository } from 'lib/types/src/index';
import { RegistrationDto } from "lib/types/src/dtos/user.interface";

import { User } from "src/lib/entities/user";
import { UserEntity } from "lib/types/src/entities/user";

@Injectable()
export class SqlUserRepository implements UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ){}

    async getUserById(userId : number):Promise<UserEntity>{
        return this.usersRepository.findOne({
            where :{
                id : userId
            }
        })
    }
    
    async getUserByEmail(email : string):Promise<UserEntity>{
        return this.usersRepository.findOne({
            where :{
                email : email
            }
        })
    }

    async createUser(input: Omit<RegistrationDto, 'code'>):Promise<void>{
        const newUser = this.usersRepository.create(input);
        await this.usersRepository.save(newUser);
    }

    async updateUserFcmToken(id: number, fcmToken: string):Promise<void>{
        await this.usersRepository.update(id,{
            fcmToken
        })
    }
}