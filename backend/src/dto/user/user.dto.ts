import { Role, User } from "src/modules/user/user.schema";

export class UserDTO
{
    username: string;
    role: Role;

    constructor(user: User)
    {
        this.username = user.username;
        this.role = user.role;
    }
}