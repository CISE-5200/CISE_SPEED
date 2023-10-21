import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { CreateArticleDTO } from "src/dto/create-Article.dto";
import { handle, handleAuth } from "../global";
import { ArticleService } from "src/modules/article/article.service";
import { UserService } from "src/modules/user/user.service";
import { Role } from "src/modules/user/user.schema";

@Controller("article")
export class ArticleController {
    constructor(private readonly articleService: ArticleService, private readonly userService: UserService) {}

    @Post("/submit") async submitArticle(@Res() response, @Body() dto: CreateArticleDTO) {
        await handle(response, async () => {
          const success = await this.articleService.create(dto);
          
          return {
                data: {
                    success: success,
                },
            };
        });
    }
    
    @Get("/all") async Articles(@Res() response) {
        await handle(response, async () => {
          const articles = await this.articleService.getAll();
    
            return {
                data: {
                    success: true,
                    articles: articles,
                },
            };
        });
    }

    @Post("/update") async Update(@Res() response, @Param("token") token, @Body() dto: CreateArticleDTO) {
        // TODO: check that user has permission to update article.
        await handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
            return {
                data: {
                    success: false,
                },
            };
        }, async () => {
            return {
                data: {
                    success: false,
                },
            };
        });
    }
}