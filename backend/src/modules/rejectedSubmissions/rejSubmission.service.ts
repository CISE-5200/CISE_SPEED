import { Model } from "mongoose";
import { Injectable, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RejSubmission } from "./rejSubmission.schema";
import { CreateArticleDTO } from "src/dto/create-Article.dto";
@Injectable()
export class RejSubmissionService {
  constructor(
    @InjectModel(RejSubmission.name)
    private rejSubmissionModel: Model<RejSubmission>,
  ) {}

  async create(createSubDto: CreateArticleDTO): Promise<RejSubmission> {
    const createdSub = new this.rejSubmissionModel(createSubDto);
    return createdSub.save();
  }

  async findAll(): Promise<RejSubmission[]> {
    return this.rejSubmissionModel.find().exec();
  }
  async findByTitleOrDOI(title: string, doi: string): Promise<RejSubmission[]> {
    console.log("Received title:", title, "Received DOI:", doi);
    const results = await this.rejSubmissionModel
      .find({
        $or: [{ title: title }, { doi: doi }],
      })
      .exec();
    console.log("Query results:", results);
    return results;
  }
}
