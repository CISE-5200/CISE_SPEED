import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Method } from "./method.schema";
import { CreateMethodDTO } from "../../dto/method/create-method.dto";
import { Model } from "mongoose";

@Injectable()
export class MethodService {
    constructor(@InjectModel(Method.name) private methodModel: Model<Method>) {}

    async add(dto: CreateMethodDTO): Promise<boolean> {
        if(dto.id === undefined || dto.id === null || dto.id.trim().length == 0 ||
            dto.name === undefined || dto.name === null || dto.name.trim().length == 0)
            return false;

        const method = await this.methodModel.findOne({ id: dto.id }).exec();

        if(method)
        {
            return false;
        }

        const createdMethod = new this.methodModel(dto);
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