import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { SubmissionService } from "../modules/submission/submission.service";
import { AccSubmissionService } from "../modules/acceptedSubmissions/accSubmission.service";
import { RejSubmissionService } from "../modules/rejectedSubmissions/rejSubmission.service";
import { ArticleService } from "../modules/Articles/article.service";
// import "@types/mongoose";

@Controller("moderator")
export class ModeratorController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly acceptedService: AccSubmissionService,
    private readonly rejectedService: RejSubmissionService,
    private readonly articlesService: ArticleService,
  ) {}
  /**
   * get the full list of submissions for moderators
   * @param response
   * @returns full list of submissions
   */
  @Get("") async getSubmissionList(@Res() response) {
    try {
      const submissions = await this.submissionService.findAll();
      return response.status(HttpStatus.OK).json({
        submissions,
      });
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err });
    }
  }
  /**
   * get a specific submission
   * @param response
   * @param articleID _ID of the submission
   * @returns the submission of the corrisponding ID
   */
  // @Get("byID/:id") async getSubmissionByID(
  //   @Res() response,
  //   @Param("id") articleID: number,
  // ) {
  //   const submission = await this.submissionService.findByID(articleID);
  //   return response.status(HttpStatus.OK).json({ submission });
  // }
  @Post("/approve") async approveSubmission(@Body() _id) {
    const submission = await this.submissionService.findThenDestroy(_id._ID);
    const jsonSub = (submission as any).toObject();
    delete jsonSub.__v;
    console.log(jsonSub);
    this.acceptedService.create(await jsonSub);
  }
  @Post("/deny") async denySubmission(@Body() _id) {
    const submission = await this.submissionService.findThenDestroy(_id._ID);
    const jsonSub = (submission as any).toObject();
    delete jsonSub.__v;
    console.log(jsonSub);
    this.rejectedService.create(await jsonSub);
  }
  @Get("/demo") async demo() {
    this.submissionService.create({
      title: "The Effects of AI on Human Cognition",
      authors: ["John Doe", "Jane Smith", "Alex Johnson"],
      date: "2023-10-15",
      journal: "Journal of Cognitive Science",
      volume: 45,
      issue: 3,
      pageRange: [122, 139],
      doi: "10.12345/jcogs.2023.45.3.01",
    });
  }
  @Get("/similar/") async getSimilar(
    @Query("title") title: string,
    @Query("doi") doi: string,
  ) {
    let acceptedSubs = (
      await this.acceptedService.findByTitleOrDOI(title, doi)
    ).map((object) => {
      return {
        title: object.title,
        authors: object.authors,
        date: object.date,
        journal: object.journal,
        volume: object.volume,
        issue: object.issue,
        doi: object.doi,
        type: "accepted",
      };
    });

    let rejectedSubs = (
      await this.rejectedService.findByTitleOrDOI(title, doi)
    ).map((object) => ({
      title: object.title,
      authors: object.authors,
      date: object.date,
      journal: object.journal,
      volume: object.volume,
      issue: object.issue,
      doi: object.doi,
      type: "rejected",
    }));

    let articles = (
      await this.articlesService.findByTitleOrDOI(title, doi)
    ).map((object) => ({
      title: object.title,
      authors: object.authors,
      date: object.date,
      journal: object.journal,
      volume: object.volume,
      issue: object.issue,
      doi: object.doi,
      type: "article",
    }));

    const mergedResults = [...acceptedSubs, ...rejectedSubs, ...articles];
    return mergedResults;
    // return { acceptedSubs, rejectedSubs, articles };
  }
}
