import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../catalogs/entities/role.entity';
import { SeniorityLevel } from '../catalogs/entities/seniority-level.entity';
import { RoleOptions } from './enums/user-roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(SeniorityLevel)
    private readonly seniorityRepository: Repository<SeniorityLevel>,
  ) {}

  //resuelve el nombre de seniority contra el catálogo (FK)
  private async resolveSeniority(name: string): Promise<SeniorityLevel> {
    const seniority = await this.seniorityRepository.findOneBy({ name });
    if (!seniority) {
      throw new BadRequestException(
        `El nivel de seniority "${name}" no existe en el catálogo`,
      );
    }
    return seniority;
  }

  async create(createUserDto: CreateUserDto) {
    const UserExist = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (UserExist) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const defaultRole = await this.rolesRepository.findOneBy({
      name: RoleOptions.USER,
    });
    if (!defaultRole) {
      throw new InternalServerErrorException(
        'El catálogo de roles está vacío: ejecuta "npm run seed" primero',
      );
    }

    let seniority: SeniorityLevel | null = null;
    if (createUserDto.seniorityLevel) {
      seniority = await this.resolveSeniority(createUserDto.seniorityLevel);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      passwordHash: hash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: defaultRole,
      seniorityLevel: seniority,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(updateUserDto.password, salt);
      user.passwordHash = hash;
    }

    const { password, seniorityLevel, ...datosAActualizar } = updateUserDto;

    if (seniorityLevel) {
      user.seniorityLevel = await this.resolveSeniority(seniorityLevel);
    }

    this.userRepository.merge(user, datosAActualizar);

    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
