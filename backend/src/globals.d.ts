import { HttpStatus } from "@nestjs/common";
import { Role, User } from "./modules/user/user.schema";
import { UserService } from "./modules/user/user.service";
    
const handleError = (err, response) => {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: { msg: err.message, stack: err.stack }});
}

export const handleAuth = (response, userService: UserService, token: string, role: Role, successResponse: (user: User) => any, failedResponse: () => any) => {
    try {
        let authResponse = await userService.tokenRoleAuth(token, role);

        if(authResponse.success) {
            return response.status(HttpStatus.OK).json(successResponse(authResponse.user));
        }
        else {
            return response.status(HttpStatus.FORBIDDEN).json(failedResponse());
        }
    } catch (err) {
        handleError(err, response);
    }
}