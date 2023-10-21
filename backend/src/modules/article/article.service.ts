import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "./article.schema";
import { CreateArticleDTO } from "../../dto/create-Article.dto";

@Injectable()
export class ArticleService {
  constructor( @InjectModel(Article.name) private articleModel: Model<Article>) {}

  async create(dto: CreateArticleDTO): Promise<boolean> {
    const createdArticle = new this.articleModel(dto);
    createdArticle.save();

    // TODO: check for duplicates?

    return true;
  }

  async getAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  async findByTitleOrDOI(title: string, doi: string): Promise<Article[]> {
    console.log("Received title:", title, "Received DOI:", doi);
    const results = await this.articleModel.find({
      $or: [{ title: title }, { doi: doi }],
    }).exec();
    console.log("Query results:", results);
    return results;
  }

  async update(id: number, dto: CreateArticleDTO): Promise<boolean> {
    let article = await this.articleModel.findOne({ id: id }).exec();

    if(!article)
    {
      return false;
    }

    return (await this.articleModel.updateOne({ id: id }).exec()).modifiedCount == 1;
  }
}
