import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTechnology } from '../entities/user-technology.entity';
import { Technology } from '../entities/technology.entity';
import { CreateUserTechnologyDto } from '../dto/create-user-technology.dto';
import { UpdateUserTechnologyDto } from '../dto/update-user-technology.dto';

@Injectable()
export class UserTechnologiesService {
  constructor(
    @InjectRepository(UserTechnology)
    private readonly userTechnologyRepository: Repository<UserTechnology>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  async listar(userId: string): Promise<UserTechnology[]> {
    return await this.userTechnologyRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });
  }

  async agregar(
    userId: string,
    createDto: CreateUserTechnologyDto,
  ): Promise<UserTechnology> {
    const technology = await this.technologyRepository.findOneBy({
      id: createDto.technologyId,
    });
    if (!technology) {
      throw new BadRequestException(
        `La tecnología con ID ${createDto.technologyId} no existe`,
      );
    }
    if (!technology.isActive) {
      throw new BadRequestException(
        `La tecnología "${technology.name}" está inactiva`,
      );
    }

    const yaExiste = await this.userTechnologyRepository.findOne({
      where: { user: { id: userId }, technology: { id: technology.id } },
    });
    if (yaExiste) {
      throw new ConflictException(
        `Ya tienes registrada la tecnología "${technology.name}"`,
      );
    }

    const registro = this.userTechnologyRepository.create({
      user: { id: userId },
      technology,
      level: createDto.level ?? null,
    });
    return await this.userTechnologyRepository.save(registro);
  }

  async actualizar(
    userId: string,
    id: string,
    updateDto: UpdateUserTechnologyDto,
  ): Promise<UserTechnology> {
    const registro = await this.buscarPropio(userId, id);
    if (updateDto.level !== undefined) {
      registro.level = updateDto.level;
    }
    return await this.userTechnologyRepository.save(registro);
  }

  async eliminar(
    userId: string,
    id: string,
  ): Promise<{ id: string; eliminada: boolean }> {
    const registro = await this.buscarPropio(userId, id);
    await this.userTechnologyRepository.remove(registro);
    return { id, eliminada: true };
  }

  private async buscarPropio(
    userId: string,
    id: string,
  ): Promise<UserTechnology> {
    const registro = await this.userTechnologyRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!registro) {
      throw new NotFoundException(
        `No tienes una tecnología registrada con el ID ${id}`,
      );
    }
    return registro;
  }
}
