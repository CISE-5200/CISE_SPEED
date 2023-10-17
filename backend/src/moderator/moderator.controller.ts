import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { SubmissionService } from "src/modules/submission/submission.service";
import { AccSubmissionService } from "src/modules/acceptedSubmissions/accSubmission.service";
import { RejSubmissionService } from "src/modules/rejectedSubmissions/rejSubmission.service";

@Controller("moderator")
export class ModeratorController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly acceptedService: AccSubmissionService,
    private readonly rejectedService: RejSubmissionService,
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
}
