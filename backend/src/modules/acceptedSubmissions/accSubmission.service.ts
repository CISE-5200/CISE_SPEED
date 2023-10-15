import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AccSubmission } from "./accSubmission.schema";
import { CreateSubDTO } from "src/dto/create-Sub.dto";

@Injectable()
export class AccSubmissionService {
  constructor(
    @InjectModel(AccSubmission.name)
    private accSubmissionModel: Model<AccSubmission>,
  ) {}

  async create(createCatDto: CreateSubDTO): Promise<AccSubmission> {
    const createdCat = new this.accSubmissionModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<AccSubmission[]> {
    return this.accSubmissionModel.find().exec();
  }
}
