import { Body, Controller, Get, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { CreateMethodDTO } from "../dto/method/create-method.dto";
import { handle, handleAuth } from "../global";
import { MethodService } from "../modules/method/method.service";
import { Role } from "../modules/user/user.schema";
import { UserService } from "../modules/user/user.service";

@Controller("method")
export class MethodController {
    constructor(private readonly methodService: MethodService, private readonly userService: UserService) {}

    @Post("/add") async AddMethod(@Res() response, @Query("token") token, @Body() dto: CreateMethodDTO) {
        await handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
            let add = await this.methodService.add(dto);

            return {
                data: {
                    success: add,
                },
            };
        }, async () => {
            return {
                data: {
                    success: false,
                },
            };
        });
    }

    @Post("/delete") async DeleteMethod(@Res() response, @Query("token") token, @Query("id") id) {
        await handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
            let update = await this.methodService.remove(id);
            
            return {
                data: {
                    success: update,
                }
            };
        }, async () => {
            return {
                data: {
                    success: false,
                },
            };
        });
    }

    @Get("/all") async AllMethods(@Res() response) {        
        await handle(response, async () => {
            let methods = await this.methodService.getAll();

            return {
                data: {
                    success: true,
                    methods: methods !== undefined && methods !== null ? methods : [],
                }
            };
        });
    }
}