import { Body, Controller, Post, Res } from "@nestjs/common";
import { CreateArticleDTO } from "../dto/create-Article.dto";
import { SubmissionService } from "../modules/submission/submission.service";
import { handle } from "../global";

@Controller("submission")
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post("/submit") async postSubmission(@Res() response,
    @Body() createArticleDTO: CreateArticleDTO,
  ) {
    await handle(response, async () => {
      let update = await this.submissionService.create(createArticleDTO);

      return {
        data: {
          success: update,
        }
      };
    });
  }
}
