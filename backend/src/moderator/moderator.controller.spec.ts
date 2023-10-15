import { Test, TestingModule } from '@nestjs/testing';
import { ModeratorController } from './moderator.controller';
import { getModelToken } from '@nestjs/mongoose';
import { SubmissionService } from '../modules/submission/submission.service';

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
        }
      ]
    }).compile();

    controller = module.get<ModeratorController>(ModeratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
