import { UserEntity } from "../user.entity";
import { UserType } from "./user.type";

export interface UserResponseInterface {
    user: UserType & {token: string}    // add field token to UserType structure
}