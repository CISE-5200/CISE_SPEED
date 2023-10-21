import { Model, ObjectId, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Submission } from "./submission.schema";
import { CreateSubDTO } from "../../dto/create-Sub.dto";

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async create(createSubDto: CreateSubDTO): Promise<Submission> {
    const createdSub = new this.submissionModel(createSubDto);
    return createdSub.save();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel.find().exec();
  }
  async findByID(id: ObjectId): Promise<Submission> {
    console.log(await this.submissionModel.findOne({ _id: id }).exec());
    return null;
  }
  async findThenDestroy(id): Promise<Submission> {
    const objectId = new Types.ObjectId(id);
    const result = this.submissionModel.findOneAndDelete({ _id: id }).exec();
    if (result) {
      const resultObject = result;
      delete (await resultObject)._id;
      delete (await resultObject).__v;
      console.log(resultObject);
      return resultObject;
    }
    return null;
  }
  async findByTitleOrDOI(title: string, doi: string): Promise<Submission[]> {
    return this.submissionModel
      .find({
        $or: [{ title: title }, { doi: doi }],
      })
      .exec();
  }
}
