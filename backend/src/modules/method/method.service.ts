import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Method } from "./method.schema";
import { CreateMethodDTO } from "src/dto/method/create-method.dto";
import { Model } from "mongoose";

@Injectable()
export class MethodService {
    constructor(@InjectModel(Method.name) private methodModel: Model<Method>) {}

    async add(dto: CreateMethodDTO): Promise<boolean> {
        const createdMethod = new this.methodModel(dto);

        if(createdMethod)
        {
            return false;
        }
        
        createdMethod.save();
        return true;
    }

    async remove(id: string): Promise<boolean> {
        return (await this.methodModel.deleteOne({ id: id }).exec()).deletedCount == 1;
    }

    async get(id: string): Promise<Method> {
        return await this.methodModel.findOne({ id: id }).exec();
    }

    async getAll(): Promise<Method[]> {
        return await this.methodModel.find().exec();
    }
}