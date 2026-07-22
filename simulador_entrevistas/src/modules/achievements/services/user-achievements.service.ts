import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../../common/pagination/paginate';
import { UserAchievement } from '../entities/user-achievement.entity';
import { Achievement } from '../entities/achievement.entity';
import { User } from '../../users/entities/user.entity';
import { GrantAchievementDto } from '../dto/grant-achievement.dto';

@Injectable()
export class UserAchievementsService {
  constructor(
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepository: Repository<UserAchievement>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async misLogros(userId: string): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find({
      where: { user: { id: userId } },
      order: { earnedAt: 'DESC' },
    });
  }

  async listarTodos(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<UserAchievement>> {
    return await paginate(this.userAchievementRepository, query, {
      sortableFields: ['earnedAt'],
      relations: { user: true },
    });
  }

  async otorgar(dto: GrantAchievementDto): Promise<UserAchievement> {
    const usuario = await this.userRepository.findOneBy({ id: dto.userId });
    if (!usuario) {
      throw new BadRequestException(`El usuario ${dto.userId} no existe`);
    }

    const logro = await this.achievementRepository.findOneBy({
      id: dto.achievementId,
    });
    if (!logro) {
      throw new BadRequestException(`El logro ${dto.achievementId} no existe`);
    }

    const yaLoTiene = await this.userAchievementRepository.findOne({
      where: { user: { id: usuario.id }, achievement: { id: logro.id } },
    });
    if (yaLoTiene) {
      throw new ConflictException(
        `El usuario ya tiene otorgado el logro "${logro.name}"`,
      );
    }

    const registro = this.userAchievementRepository.create({
      user: usuario,
      achievement: logro,
    });
    return await this.userAchievementRepository.save(registro);
  }

  async revocar(id: string): Promise<{ id: string; revocado: boolean }> {
    const registro = await this.userAchievementRepository.findOneBy({ id });
    if (!registro) {
      throw new NotFoundException(
        `No existe un logro otorgado con el ID ${id}`,
      );
    }
    await this.userAchievementRepository.remove(registro);
    return { id, revocado: true };
  }
}
