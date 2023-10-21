import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SubmissionService } from "./modules/submission/submission.service";
import {
  Submission,
  SubmissionSchema,
} from "./modules/submission/submission.schema";
import {
  AccSubmission,
  AccSubmissionSchema,
} from "./modules/acceptedSubmissions/accSubmission.schema";
import {
  RejSubmission,
  RejSubmissionSchema,
} from "./modules/rejectedSubmissions/rejSubmission.schema";
import { Article, ArticleSchema } from "./modules/Articles/article.schema";
import { UserController } from "./user/user.controller";
import { AdminController } from "./admin/admin.controller";
import { ModeratorController } from "./moderator/moderator.controller";
import { AnalystController } from "./analyst/analyst.controller";
import { AccSubmissionService } from "./modules/acceptedSubmissions/accSubmission.service";
import { RejSubmissionService } from "./modules/rejectedSubmissions/rejSubmission.service";
import { ArticleService } from "./modules/Articles/article.service";
import { Session, SessionSchema, User, UserSchema } from "./modules/user/user.schema";
import { UserService } from "./modules/user/user.service";
import { Method, MethodSchema } from "./modules/method/method.schema";
import { MethodController } from "./method/method.controller";
import { MethodService } from "./modules/method/method.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {}),
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    MongooseModule.forFeature([
      { name: AccSubmission.name, schema: AccSubmissionSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: RejSubmission.name,
        schema: RejSubmissionSchema,
      },
    ]),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: Method.name, schema: MethodSchema }]),
  ],
  controllers: [
    AppController,
    UserController,
    AdminController,
    ModeratorController,
    AnalystController,
    MethodController,
  ],
  providers: [
    AppService,
    SubmissionService,
    AccSubmissionService,
    RejSubmissionService,
    ArticleService,
    UserService,
    MethodService,
  ],
})
export class AppModule {}
