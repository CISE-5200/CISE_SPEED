import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { SubmissionService } from "src/modules/submission/submission.service";

@Controller("moderator")
export class ModeratorController {
  constructor(private readonly submissionService: SubmissionService) {}
  /**
   * get the full list of submissions for moderators
   * @param response
   * @returns full list of submissions
   */
  @Get("") async getSubmissionList(@Res() response) {
    try {
      const submissions = await this.submissionService.findAll();
      return response.status(HttpStatus.FOUND).json({
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
  @Get("/:id") async getSubmissionByID(
    @Res() response,
    @Param("id") articleID: number,
  ) {
    const submission = await this.submissionService.findByID(articleID);
    return response.status(HttpStatus.OK).json({ submission });
  }
}
