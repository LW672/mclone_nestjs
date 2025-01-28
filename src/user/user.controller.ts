import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";

@Controller()
export class UserController {
    constructor (private readonly userService: UserService) { }
    
    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') 
        createUserDto: CreateUserDto 
    ): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserReponse(user);
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async loginUser(
        @Body('user')
        loginUserDto: LoginUserDto
    ) : Promise<UserResponseInterface> {
        const loginUser = await this.userService.loginUser(loginUserDto);
        return this.userService.buildUserReponse(loginUser);
    }

    @Get('user')
    async currentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInterface> {
        return this.userService.buildUserReponse(request.user);
    }
    
    
}