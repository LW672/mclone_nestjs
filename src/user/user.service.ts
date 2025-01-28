import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { HttpException, HttpStatus, Injectable, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import { compare } from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}
    
    async createUser( createUserDto: CreateUserDto ) : Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            where: { email: createUserDto.email }
        })
        const userByUsername = await this.userRepository.findOne({
            where: { email: createUserDto.username }
        })
        if (userByEmail || userByUsername) {
            throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return await this.userRepository.save(newUser);
    }

    async loginUser( loginUserDto: LoginUserDto ) : Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email },
            select: ['id', 'username', 'email', 'bio', 'image', 'password']
        })
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const isPasswordCorrect = await compare(loginUserDto.password, user.password )  // from bcrypt-compares hashed PWD in DB with PWD as string
        if (!isPasswordCorrect) {
            throw new HttpException('Password incorrect', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        delete user.password;
        return user;
    }

    findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { id } });
    }

    generateJwt(user: UserEntity): string { 
        return sign({
            id: user.id,
            username: user.username,
            email: user.email,
        }, 
        JWT_SECRET,
    );
    }

    buildUserReponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user),
            },
        }
    }
}
