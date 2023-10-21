import { Test, TestingModule } from '@nestjs/testing';
import { ModeratorController } from './moderator.controller';
import { SubmissionService } from '../modules/submission/submission.service';
import { getModelToken } from '@nestjs/mongoose';
import { RejSubmissionService } from '../modules/rejectedSubmissions/rejSubmission.service';
import { AccSubmissionService } from '../modules/acceptedSubmissions/accSubmission.service';
import { ArticleService } from '../modules/article/article.service';

describe('ModeratorController', () => {
  let controller: ModeratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModeratorController],
      providers: [
        SubmissionService,
        {
          provide: getModelToken('Submission'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        },
        AccSubmissionService,
        {
          provide: getModelToken('AccSubmission'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        },
        RejSubmissionService,
        {
          provide: getModelToken('RejSubmission'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        },
        ArticleService,
        {
          provide: getModelToken('Article'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<ModeratorController>(ModeratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
