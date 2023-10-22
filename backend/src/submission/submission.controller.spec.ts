import { Test, TestingModule } from "@nestjs/testing";
import { SubmissionController } from "./submission.controller";
import { SubmissionService } from "src/modules/submission/submission.service";
import { getModelToken } from "@nestjs/mongoose";

describe("SubmissionController", () => {
  let controller: SubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        SubmissionService,
        {
          provide: getModelToken("Submission"),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
