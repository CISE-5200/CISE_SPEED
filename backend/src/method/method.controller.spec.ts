import { Test, TestingModule } from '@nestjs/testing';
import { MethodController } from './method.controller';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../modules/user/user.service';
import { MethodService } from 'src/modules/method/method.service';

describe('MethodController', () => {
  let controller: MethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MethodController],
      providers: [
        MethodService,
        {
          provide: getModelToken('Method'),
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

    controller = module.get<MethodController>(MethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
