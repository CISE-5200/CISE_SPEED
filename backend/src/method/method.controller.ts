import { Body, Controller, Get, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { CreateMethodDTO } from "src/dto/method/create-method.dto";
import { handleAuth } from "src/globals";
import { MethodService } from "src/modules/method/method.service";
import { Role } from "src/modules/user/user.schema";
import { UserService } from "src/modules/user/user.service";

@Controller("method")
export class MethodController {
    constructor(private readonly methodService: MethodService, private readonly userService: UserService) {}

    @Post("/add") async AddMethod(@Res() response, @Query("token") token, @Body() dto: CreateMethodDTO) {
        handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
            return {
                
            };
        }, () => {
            return {
                success: false,
            };
        });
    }

    @Post("/delete") async DeleteMethod(@Res() response, @Query("token") token, @Query("id") id) {
        handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
            let update = await this.methodService.remove(id);
            
            return {
                success: update,
            };
        }, () => {
            return {
                success: false,
            };
        });
    }

    @Get("/all") async AllMethods(@Res() response) {
        let methods = this.methodService.getAll();
        
        return response.status(HttpStatus.OK).json({
            success: true,
            methods: methods !== undefined && methods !== null ? methods : [],
        });
    }
}