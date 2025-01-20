import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "@app/dto/createUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";

@Controller()
export class UserController {
    constructor (private readonly userService: UserService) {

    }
    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') 
        createUserDto: CreateUserDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserReponse(user);
    }
}