import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { CreateSubDTO } from "../dto/create-Sub.dto";
import { SubmissionService } from "../modules/submission/submission.service";

@Controller("user")
export class UserController {
  constructor(private readonly submissionService: SubmissionService) {}
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
}
