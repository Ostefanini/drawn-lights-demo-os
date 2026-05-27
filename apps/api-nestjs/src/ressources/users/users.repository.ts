import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserWithCombinationCount } from './users.type.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<UserWithCombinationCount[]> {
    return await this.prisma.user.findMany({
      select: {
        nickname: true,
        _count: {
          select: { combinations: true },
        },
      },
    });
  }
}
