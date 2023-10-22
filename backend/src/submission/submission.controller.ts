import { Body, Controller, Post } from "@nestjs/common";
import { CreateArticleDTO } from "../dto/create-Article.dto";
import { SubmissionService } from "../modules/submission/submission.service";

@Controller("submission")
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post("/submit") async postSubmission(
    @Body() createArticleDTO: CreateArticleDTO,
  ) {
    console.log(createArticleDTO);
    this.submissionService.create(createArticleDTO);
  }
}
