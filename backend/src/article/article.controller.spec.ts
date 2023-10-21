import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../modules/user/user.service';
import { ArticleService } from 'src/modules/article/article.service';

describe('ArticleController', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        ArticleService,
        {
          provide: getModelToken('Article'),
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
        },
        {
          provide: getModelToken('Session'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
