import { Body, Controller, Get, Query, Post, Res } from "@nestjs/common";
import { CreateArticleDTO } from "../dto/create-Article.dto";
import { handle, handleAuth } from "../global";
import { ArticleService } from "../modules/article/article.service";
import { UserService } from "../modules/user/user.service";
import { Role } from "../modules/user/user.schema";

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

    @Post("/update") async Update(@Res() response, @Query("token") token, @Body() dto: CreateArticleDTO) {
        await handleAuth(response, this.userService, token, Role.ADMIN, async (_) => {
            let update = await this.articleService.update(dto._ID, dto);

            return {
                data: {
                    success: update,
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