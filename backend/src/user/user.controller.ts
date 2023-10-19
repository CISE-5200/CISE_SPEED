import { Body, Controller, Get, HttpStatus, Post, Res, Req, Query } from "@nestjs/common";
import { CreateSubDTO } from "../dto/create-Sub.dto";
import { SubmissionService } from "../modules/submission/submission.service";
import { UserService } from "../modules/user/user.service";
import { UserLoginRequestDTO } from "../dto/user/user-login-request.dto";
import { CreateUserDTO } from "../dto/user/create-User.dto";
import { UserDTO } from "../dto/user/user.dto";
import { UserSessionDTO } from "../dto/user/user-session.dto";

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

      if(newUser === null)
      {
        return response.status(HttpStatus.NOT_ACCEPTABLE).json({
          success: false
        })
      }
      else
      {
        return response.status(HttpStatus.CREATED).json({
          success: true,
          user: newUser,
        });
      }
    }
    catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: { msg: err.message, stack: err.stack } });
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: { msg: err.message, stack: err.stack } });
    }
  }

  @Get("/auth?") async Auth(@Res() response, @Query("username") username, @Query("token") token) {
    try {
      const user = await this.userService.findByUsername(username);

      if(user !== undefined && user !== null && await this.userService.verify(username, token))
      {
        return response.status(HttpStatus.OK).json({
          success: true,
          user: new UserDTO(user),
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: { msg: err.message, stack: err.stack }});
    }
  }
}
