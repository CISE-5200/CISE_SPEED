import { Test, TestingModule } from "@nestjs/testing";
import { AnalystController } from "./analyst.controller";
import { ArticleService } from "src/modules/article/article.service";
import { AccSubmissionService } from "src/modules/acceptedSubmissions/accSubmission.service";
import { getModelToken } from "@nestjs/mongoose";

describe("AnalystController", () => {
  let controller: AnalystController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalystController],
      providers: [
        AccSubmissionService,
        {
          provide: getModelToken("AccSubmission"),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        ArticleService,
        {
          provide: getModelToken("Article"),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalystController>(AnalystController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
