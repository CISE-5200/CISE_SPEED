import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission } from './submission.schema';
import { CreateSubDTO } from 'src/dto/create-Sub.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async create(createCatDto: CreateSubDTO): Promise<Submission> {
    const createdCat = new this.submissionModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel.find().exec();
  }
}
