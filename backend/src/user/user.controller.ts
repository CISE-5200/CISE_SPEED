import { Body, Controller, Get, HttpStatus, Post, Res, Query } from "@nestjs/common";
import { CreateSubDTO } from "../dto/create-Sub.dto";
import { SubmissionService } from "../modules/submission/submission.service";
import { UserService } from "../modules/user/user.service";
import { UserLoginRequestDTO } from "../dto/user/user-login-request.dto";
import { CreateUserDTO } from "../dto/user/create-User.dto";
import { UserDTO } from "../dto/user/user.dto";
import { UserSessionDTO } from "../dto/user/user-session.dto";
import { Role, User } from "../modules/user/user.schema";
import { UserChangeRoleRequestDTO } from "src/dto/user/user-change-role-request.dto";

@Controller("user")
export class UserController {
  constructor(private readonly submissionService: SubmissionService, private readonly userService: UserService) {}
  @Post("/submit") async submitArticle(
    @Res() response,
    @Body() CreateSubDTO: CreateSubDTO,
  ) {
    try {
      const newSubmission = await this.submissionService.create(CreateSubDTO);
      return response.status(HttpStatus.CREATED).json({
        success: true,
        newSubmission,
      });
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err });
    }
  }

  @Get("/list") async GetArticles(
    @Res() response
  ) {
    try {
      const articles = await this.submissionService.findAll();
      return response.status(HttpStatus.OK).json({
        success: true,
        articles,
      });
    }
    catch (err)
    {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err });
    }
  }

  @Post("/register") async Register(@Res() response, @Body() dto: CreateUserDTO) {
    try {
      const newUser = await this.userService.create(dto);

      if(newUser === undefined)
      {
        return response.status(HttpStatus.NOT_ACCEPTABLE).json({
          success: false,
          message: 'Failed to create user.',
        })
      }
      else if(newUser === null)
      {
        return response.status(HttpStatus.OK).json({
          success: false,
          message: `A user with the username ${dto.username} already exists.`,
        })
      }
      else
      {
        return response.status(HttpStatus.CREATED).json({
          success: true,
          session: new UserSessionDTO(new UserDTO(newUser.user), newUser.session),
        });
      }
    }
    catch (err) {
      this.handleError(err, response);
    }
  }

  @Post("/login") async Login(@Res() response, @Body() userLoginRequest: UserLoginRequestDTO) {
    try {
      const user = await this.userService.findByUsername(userLoginRequest.username);
      let session = null;

      if(user !== undefined && user !== null && (session = await this.userService.authenticate(userLoginRequest.password, user)))
      {
        return response.status(HttpStatus.OK).json({
          success: true,
          session: new UserSessionDTO(new UserDTO(user), session),
        });
      }
      else
      {
        return response.status(HttpStatus.OK).json({
          success: false,
          message: 'Invalid username or password.',
        });
      }
    }
    catch (err)
    {
      this.handleError(err, response);
    }
  }

  async handleError(err, response) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: { msg: err.message, stack: err.stack }});
  }

  @Post("/changeRole") async ChangeRole(@Res() response, @Query("token") token, @Body() dto: UserChangeRoleRequestDTO) {
    try {
      let authResponse = await this.userService.tokenRoleAuth(token, Role.ADMIN);
      if(authResponse.success) {
        if(dto.user.username !== authResponse.user.username)
        {
          let update = await this.userService.update(dto.user.username, dto.role);

          return response.status(HttpStatus.OK).json({
            success: update,
          });
        }
        else
        {
          return response.status(HttpStatus.FORBIDDEN).json({
            success: false,
          });
        }
      }
      else
      {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
        });
      }
    }
    catch (err)
    {
      this.handleError(err, response);
    }
  }

  @Post("/delete") async Delete(@Res() response, @Query("token") token, @Body() dto: UserDTO) {
    try {
      let authResponse = await this.userService.tokenRoleAuth(token, Role.ADMIN)
      if(authResponse.success) {
        if(dto.username !== authResponse.user.username)
        {
          let update = await this.userService.delete(dto.username);

          return response.status(HttpStatus.OK).json({
            success: update,
          });
        }
        else
        {
          return response.status(HttpStatus.FORBIDDEN).json({
            success: false,
          });
        }
      }
      else
      {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
        });
      }
    } catch (err) {
      this.handleError(err, response);
    }
  }

  @Get("/auth?") async Auth(@Res() response, @Query("token") token) {
    try {
      const userSession = await this.userService.findBySession(token);

      if(userSession !== undefined && userSession !== null && await this.userService.verify(userSession.session))
      {
        return response.status(HttpStatus.OK).json({
          success: true,
          user: new UserDTO(userSession.user),
        });
      }
      else
      {
        return response.status(HttpStatus.OK).json({
          success: false,
        });
      }
    }
    catch (err)
    {
      this.handleError(err, response);
    }
  }

  @Get("/users?") async Users(@Res() response, @Query("token") token) {
    try {
      if((await this.userService.tokenRoleAuth(token, Role.ADMIN)).success) {
        let users = await this.userService.getAll();
        let userDTOs = users.map((user) => {
          return new UserDTO(user);
        });

        return response.status(HttpStatus.OK).json({
          success: true,
          users: userDTOs,
        });
      } else {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
        });
      }
    }
    catch (err)
    {
      this.handleError(err, response);
    }
  }
}
