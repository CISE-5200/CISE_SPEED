import { HttpStatus } from "@nestjs/common";
import { Role, User } from "./modules/user/user.schema";
import { UserService } from "./modules/user/user.service";
    
const handleError = (err, response) => {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: { msg: err.message, stack: err.stack }});
}

export interface OutgoingResponse {
    status?: HttpStatus;
    data: any;
}

export const handleAuth = async (response, userService: UserService, token: string, role: Role, successResponse: (user: User) => Promise<OutgoingResponse>, failedResponse: () => Promise<OutgoingResponse>) => {
    try {
        let authResponse = await userService.tokenRoleAuth(token, role);

        if(authResponse.success) {
            let outgoingResponse = await successResponse(authResponse.user);
            return response.status(outgoingResponse.status !== undefined ? outgoingResponse.status : HttpStatus.OK).json(outgoingResponse.data);
        }
        else {
            let outgoingResponse = await failedResponse();
            return response.status(outgoingResponse.status !== undefined ? outgoingResponse.status : HttpStatus.UNAUTHORIZED).json(outgoingResponse.data);
        }
    } catch (err) {
        handleError(err, response);
    }
}

export const handle = async (response, createResponse: () => Promise<OutgoingResponse>) => {
    try {
        let outgoingResponse = await createResponse();
        return response.status(outgoingResponse.status !== undefined ? outgoingResponse.status : HttpStatus.OK).json(outgoingResponse.data);
    } catch (err) {
        handleError(err, response);
    }
}