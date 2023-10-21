import { Role } from "../../modules/user/user.schema";
import { UserDTO } from "./user.dto";

export class UserChangeRoleRequestDTO {
    user: UserDTO;
    role: Role;
};