import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AccSubmission } from "./accSubmission.schema";
import { Submission } from "../submission/submission.schema";
import { CreateArticleDTO } from "src/dto/create-Article.dto";
import { log } from "console";

@Injectable()
export class AccSubmissionService {
  constructor(
    @InjectModel(AccSubmission.name)
    private accSubmissionModel: Model<AccSubmission>,
  ) {}

  async create(createArticleDto: CreateArticleDTO): Promise<AccSubmission> {
    const createdSub = new this.accSubmissionModel(createArticleDto);
    console.log(createdSub);
    return createdSub.save();
  }

  async findAll(): Promise<AccSubmission[]> {
    return this.accSubmissionModel.find().exec();
  }
  async findByTitleOrDOI(title: string, doi: string): Promise<AccSubmission[]> {
    const results = await this.accSubmissionModel
      .find({
        $or: [{ title: title }, { doi: doi }],
      })
      .exec();
    return results;
  }
  async removeSubmission(id): Promise<boolean> {
    try {
      const result = this.accSubmissionModel.deleteOne({ _ID: id }).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
}
