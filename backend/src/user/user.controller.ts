import { Body, Controller, Get, HttpStatus, Post, Res, Query } from "@nestjs/common";
import { UserService } from "../modules/user/user.service";
import { UserLoginRequestDTO } from "../dto/user/user-login-request.dto";
import { CreateUserDTO } from "../dto/user/create-User.dto";
import { UserDTO } from "../dto/user/user.dto";
import { UserSessionDTO } from "../dto/user/user-session.dto";
import { Role } from "../modules/user/user.schema";
import { UserChangeRoleRequestDTO } from "../dto/user/user-change-role-request.dto";
import { handle, handleAuth } from "../global";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register") async Register(@Res() response, @Body() dto: CreateUserDTO) {
    await handle(response, async () => {
      const newUser = await this.userService.create(dto);

      if(newUser === undefined)
      {
        return {
          status: HttpStatus.NOT_ACCEPTABLE,
          data: {
            success: false,
            message: 'Failed to create user.',
          },
        };
      }
      else if(newUser === null)
      {
        return {
          data: {
            success: false,
            message: `A user with the username ${dto.username} already exists.`,
          },
        };
      }
      else
      {
        return {
          data: {
            success: true,
            session: new UserSessionDTO(new UserDTO(newUser.user), newUser.session),
          },
        };
      }
    });
  }

  @Post("/login") async Login(@Res() response, @Body() userLoginRequest: UserLoginRequestDTO) {
    await handle(response, async () => {
      const user = await this.userService.findByUsername(userLoginRequest.username);
      let session = null;

      if(user !== undefined && user !== null && (session = await this.userService.authenticate(userLoginRequest.password, user)))
      {
        return {
          data: {
            success: true,
            session: new UserSessionDTO(new UserDTO(user), session),
          },
        }
      }
      else
      {
        return {
          data: {
            success: false,
            message: 'Invalid username or password.',
          },
        };
      }
    });
  }

  @Post("/changeRole") async ChangeRole(@Res() response, @Query("token") token, @Body() dto: UserChangeRoleRequestDTO) {
    await handleAuth(response, this.userService, token, Role.ADMIN, async (user) => {
      if(dto.user.username !== user.username) {
        let update = await this.userService.update(dto.user.username, dto.role);

        return {
          data: {
            success: update,
          },
        };
      }
      else {
        return {
          status: HttpStatus.FORBIDDEN,
          data: {
            success: false,
          },
        };
      }
    }, async () => {
      return {
        data: {
          success: false,
        },
      };
    });
  }

  @Post("/delete") async Delete(@Res() response, @Query("token") token, @Body() dto: UserDTO) {
    await handleAuth(response, this.userService, token, Role.ADMIN, async (user) => {
      if(dto.username !== user.username)
      {
        let update = await this.userService.delete(dto.username);

        return {
          data: {
            success: update,
          },
        };
      }
      else
      {
        return {
          data: {
            success: false,
          },
        };
      }
    }, async () => {
      return {
        data: {
          success: false,
        },
      };
    });
  }

  @Get("/auth?") async Auth(@Res() response, @Query("token") token) {
    await handle(response, async () => {
      const userSession = await this.userService.findBySession(token);

      if(userSession !== undefined && userSession !== null && await this.userService.verify(userSession.session))
      {
        return {
          data: {
            success: true,
            user: new UserDTO(userSession.user),
          },
        };
      }
      else
      {
        return {
          data: {
            success: false,
          },
        };
      }
    });
  }

  @Get("/all?") async Users(@Res() response, @Query("token") token) {
    await handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
      let users = await this.userService.getAll();
      let userDTOs = users.map((user) => {
        return new UserDTO(user);
      });

      return {
        data: {
          success: true,
          users: userDTOs,
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
}
