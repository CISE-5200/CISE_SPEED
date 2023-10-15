import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RejSubmission } from "./rejSubmission.schema";
import { CreateSubDTO } from "src/dto/create-Sub.dto";

@Injectable()
export class RejSubmissionService {
  constructor(
    @InjectModel(RejSubmission.name)
    private rejSubmissionModel: Model<RejSubmission>,
  ) {}

  async create(createCatDto: CreateSubDTO): Promise<RejSubmission> {
    const createdCat = new this.rejSubmissionModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<RejSubmission[]> {
    return this.rejSubmissionModel.find().exec();
  }
}
