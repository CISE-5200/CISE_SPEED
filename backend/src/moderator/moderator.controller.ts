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
import { ArticleService } from "../modules/article/article.service";
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
    this.acceptedService.create(await jsonSub);
  }
  @Post("/deny") async denySubmission(@Body() _id) {
    const submission = await this.submissionService.findThenDestroy(_id._ID);
    const jsonSub = (submission as any).toObject();
    delete jsonSub.__v;
    this.rejectedService.create(await jsonSub);
  }

  @Get("/demo") async demo() {
    this.submissionService.create({
      title: "Sample Title 1",
      authors: ["Author 1", "Author 2"],
      journal: "Journal 1",
      year: "2022",
      source: "Source 1",
      doi: "DOI 1",
      method: "Method 1",
      claim: "Claim 1",
      result: "Result 1",
      researchType: "Research Type 1",
      abstract: "Abstract 1",
      _ID: "",
      participant: "",
      type: "",
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
        journalName: object.journalName,
        pubYear: object.pubYear,
        source: object.source,
        DOI: object.DOI,
        method: object.method,
        claim: object.claim,
        result: object.result,
        researchType: object.researchType,
        abstract: object.abstract,
        type: "accepted",
      };
    });

    let rejectedSubs = (
      await this.rejectedService.findByTitleOrDOI(title, doi)
    ).map((object) => ({
      title: object.title,
      authors: object.authors,
      journalName: object.journalName,
      pubYear: object.pubYear,
      source: object.source,
      DOI: object.DOI,
      method: object.method,
      claim: object.claim,
      result: object.result,
      researchType: object.researchType,
      abstract: object.abstract,
      type: "rejected",
    }));

    let articles = (
      await this.articlesService.findByTitleOrDOI(title, doi)
    ).map((object) => ({
      title: object.title,
      authors: object.authors,
      journalName: object.journalName,
      pubYear: object.pubYear,
      source: object.source,
      DOI: object.DOI,
      method: object.method,
      claim: object.claim,
      result: object.result,
      researchType: object.researchType,
      abstract: object.abstract,
      type: "article",
    }));

    const mergedResults = [...acceptedSubs, ...rejectedSubs, ...articles];
    return mergedResults;
  }
}
