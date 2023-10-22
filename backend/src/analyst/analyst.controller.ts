import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { CreateArticleDTO } from "src/dto/create-Article.dto";
import { AccSubmissionService } from "src/modules/acceptedSubmissions/accSubmission.service";
import { Article } from "src/modules/article/article.schema";
import { ArticleService } from "src/modules/article/article.service";

@Controller("analyst")
export class AnalystController {
  constructor(
    private readonly acceptedService: AccSubmissionService,
    private readonly articlesService: ArticleService,
  ) {}
  @Get("") async getSubmissionList(@Res() response) {
    try {
      const submissions = await this.acceptedService.findAll();
      return response.status(HttpStatus.OK).json({
        submissions,
      });
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err });
    }
  }
  @Post("/submit") async approveSubmission(@Body() dto: CreateArticleDTO) {
    await this.acceptedService.removeSubmission(dto._ID);
    let jsonSub = dto as any;
    delete jsonSub.__v;
    console.log("fuck shit piss");
    console.log(jsonSub);
    this.articlesService.create(await jsonSub);
  }
}
