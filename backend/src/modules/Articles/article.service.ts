import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "./article.schema";
import { CreateArticleDTO } from "src/dto/create-Article.dto";
@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private ArticleModel: Model<Article>,
  ) {}

  async create(createCatDto: CreateArticleDTO): Promise<Article> {
    const createdCat = new this.ArticleModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Article[]> {
    return this.ArticleModel.find().exec();
  }
}
