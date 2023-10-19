import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { SubmissionService } from '../modules/submission/submission.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../modules/user/user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        SubmissionService,
        {
          provide: getModelToken('Submission'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        },
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
