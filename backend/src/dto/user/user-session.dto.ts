import { Session } from "../../modules/user/user.schema";
import { UserDTO } from "./user.dto";

export class UserSessionDTO {
    user: UserDTO;
    token: string;

    constructor(user: UserDTO, session: Session)
    {
        this.user = user;
        this.token = session.token;
    }
};