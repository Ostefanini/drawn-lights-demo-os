import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  describe('findAll', () => {
    it('should transform repository data to UserListHighscore format', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          nickname: 'player1',
          _count: { combinations: 5 },
          createdAt: new Date(),
        },
        {
          id: 'user-2',
          nickname: 'player2',
          _count: { combinations: 3 },
          createdAt: new Date(),
        },
      ];

      repository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual([
        { nickname: 'player1', nbCombinationsFound: 5 },
        { nickname: 'player2', nbCombinationsFound: 3 },
      ]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle users with zero combinations', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          nickname: 'newbie',
          _count: { combinations: 0 },
          createdAt: new Date(),
        },
      ];

      repository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual([{ nickname: 'newbie', nbCombinationsFound: 0 }]);
    });
  });
});
